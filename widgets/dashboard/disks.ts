import AstalIO from 'gi://AstalIO?version=0.1';
import GTop from 'gi://GTop?version=2.0';
import Gio from 'gi://Gio?version=2.0';
import { formatSize } from './formatSize';

export interface DiskInfo {
	device: string;
	mountInfo?: MountInfo | SwapInfo;
}

export interface MountInfo {
	type: 'dataPartition';
	mountedOn: string;
	filesystem: string;
	diskSize: number;
	used: number;
	usedDisplay: string;
	diskSizeDisplay: string;
}

export interface SwapInfo {
	type: 'swapPartition';
	diskSize: number;
	used: number;
	usedDisplay: string;
	diskSizeDisplay: string;
}

export function getDisks(): DiskInfo[] {
	const disksResult: DiskInfo[] = [];
	const enumerator = Gio.file_new_for_path('/dev/block').enumerate_children(
		'standard::symlink-target',
		null,
		null,
	);

	for (const entry of enumerator) {
		const deviceName = entry.get_symlink_target()?.split('/')[1];
		if (!deviceName || deviceName.startsWith('loop') || !deviceName.match(/\d/))
			continue;

		const fullPath = `/dev/${deviceName}`;

		// Verifica se o dispositivo é uma partição de swap
		const swapInfo = getSwapInfo(fullPath);
		if (swapInfo) {
			disksResult.push({
				device: fullPath,
				mountInfo: swapInfo,
			});
			continue;
		}

		// Caso contrário, obtém informações de montagem
		const mountInfo = getMountInfo(fullPath);
		disksResult.push({
			device: fullPath,
			mountInfo,
		});
	}
	disksResult.sort((a, b) => (a.device > b.device ? 1 : -1));
	return disksResult;
}

// Função para obter informações de montagem
function getMountInfo(devicePath: string): MountInfo | null {
	const mountsFile = '/proc/mounts';
	try {
		const mountsContent = AstalIO.read_file(mountsFile);
		const lines = mountsContent.split('\n');

		for (const line of lines) {
			const [device, mountedOn, filesystem] = line.split(' ');
			const gtopFsusage = new GTop.glibtop_fsusage();
			GTop.glibtop_get_fsusage(gtopFsusage, mountedOn);
			if (device === devicePath) {
				return {
					type: 'dataPartition',
					mountedOn,
					filesystem,
					diskSize: gtopFsusage.blocks * gtopFsusage.block_size,
					used:
						(gtopFsusage.blocks - gtopFsusage.bfree) * gtopFsusage.block_size,
					get usedDisplay() {
						return formatSize(this.used);
					},
					get diskSizeDisplay() {
						return formatSize(this.diskSize);
					},
				};
			}
		}
	} catch (e) {
		logError(e, 'Failed to read mount info');
	}
	return null;
}

// Função para obter informações de swap
function getSwapInfo(devicePath: string): SwapInfo | null {
	const swapsFile = '/proc/swaps';
	try {
		const swapsContent = AstalIO.read_file(swapsFile);
		const lines = swapsContent.split('\n');

		// Procura o dispositivo em /proc/swaps
		for (const line of lines) {
			const [filename, , size, used] = line.split(/\s+/);
			if (filename === devicePath) {
				return {
					type: 'swapPartition',
					diskSize: Number.parseInt(size, 10) * 1024, // Em bytes
					used: Number.parseInt(used, 10) * 1024, // Em bytes
					get usedDisplay() {
						return formatSize(this.used);
					},
					get diskSizeDisplay() {
						return formatSize(this.diskSize);
					},
				};
			}
		}
	} catch (e) {
		logError(e, 'Failed to read swap info');
	}
	return null;
}
