import { astalify, Gtk, Widget } from 'astal/gtk3';
import { WidgetContainer } from './WidgetContainer';
import GTop from 'gi://GTop?version=2.0';
import Variable from 'astal/variable';
import { type LevelBar } from 'astal/gtk3/widget';
import { DiskInfo, getDisks } from './disks';
import { formatSize } from './formatSize';
const GtkArrow = astalify(Gtk.Arrow);
const memory = Variable(new GTop.glibtop_mem()).poll(100, () => {
	const memory = new GTop.glibtop_mem();
	GTop.glibtop_get_mem(memory);
	return memory;
});

const cpu = Variable({ cpu: new GTop.glibtop_cpu(), load: 0 }).poll(
	500,
	({ cpu: lastCpu }) => {
		const cpu = new GTop.glibtop_cpu();
		GTop.glibtop_get_cpu(cpu);

		const used = cpu.user + cpu.sys + cpu.nice + cpu.irq + cpu.softirq;
		const total = used + cpu.idle + cpu.iowait;

		const lastUsed =
			lastCpu.user + lastCpu.sys + lastCpu.nice + lastCpu.irq + lastCpu.softirq;
		const lastTotal = lastUsed + lastCpu.idle + lastCpu.iowait;

		const diffUsed = used - lastUsed;
		const diffTotal = total - lastTotal;

		return { cpu, load: diffTotal > 0 ? diffUsed / diffTotal : 0 };
	},
);
const disks = Variable(getDisks()).poll(500, getDisks);
function setupLevelBarOffsets(bar: LevelBar) {
	bar.add_offset_value('low', 0.4);
	bar.add_offset_value('medium', 0.75);
	bar.add_offset_value('high', 1.0);
}
export function ResourceMonitorWidget() {
	return (
		<WidgetContainer className="system-monitor-widget">
			<box className="widget-header" spacing={24} hexpand>
				<label
					className={'widget-icon widget-icon-resource-monitor'}
					label="󰾆"
					halign={Gtk.Align.START}
					valign={Gtk.Align.BASELINE}
				/>
				<label
					className={'widget-title'}
					label="Monitor de Recursos"
					halign={Gtk.Align.START}
					valign={Gtk.Align.BASELINE}
				/>
			</box>
			<box hexpand vertical className={'widget-body'}>
				<box className="cpu-container" spacing={16}>
					<label className="icon cpu" label="" />
					<label xalign={0} className="label" label="CPU" />
					<levelbar
						valign={Gtk.Align.CENTER}
						setup={setupLevelBarOffsets}
						value={cpu(cpu => cpu.load)}
						hexpand
					/>
					<label
						xalign={0}
						className="indicator"
						label={cpu(cpu => `${(cpu.load * 100).toFixed(2)}%`)}
					/>
				</box>
				<box className="ram-container" spacing={16}>
					<label className="icon" label="" />
					<label xalign={0} className="label" label="Memória" />
					<levelbar
						valign={Gtk.Align.CENTER}
						setup={setupLevelBarOffsets}
						value={memory(memory => memory.user / memory.total)}
						hexpand
					/>
					<label
						xalign={0}
						className="indicator"
						label={memory(
							memory =>
								`${formatSize(memory.user)} / ${formatSize(memory.total)}`,
						)}
					/>
				</box>
				<box className="disks-container" vertical>
					<box className="disks-header" spacing={16}>
						<label className="icon" label="" />
						<label xalign={0} className="label" label="Discos" />
					</box>
					<box vertical spacing={16} className="disks-list">
						{disks(disks => disks.map(disk => 
                            <box spacing={16}>
                                <label className="device-name" label={disk.device}/>
                                {disk.mountInfo ? <>
                                    {
                                        disk.mountInfo.type === "swapPartition" ?
                                        <box className="arrow"/>:
                                        <label className="arrow" label="--->"/>
                                    }
									{
										disk.mountInfo.type === "dataPartition"
										? <label xalign={0} className="mountpoint" label={disk.mountInfo.mountedOn}/>
										: <label xalign={0} className="mountpoint mountpoint-swap" label={"SWAP"}/>
									}
                                    <levelbar
										valign={Gtk.Align.CENTER}
										setup={setupLevelBarOffsets}
										value={disk.mountInfo.used / disk.mountInfo.diskSize}
									/>
									<label
										xalign={0}
										className="indicator"
										label={`${disk.mountInfo.usedDisplay} / ${disk.mountInfo.diskSizeDisplay}`}
									/>
                                    
									<label
										xalign={0}
										label={disk.mountInfo.type === "swapPartition" ? "" : disk.mountInfo.filesystem.toUpperCase()}
									/>
                                    
                                </>: <label css="color: @base08; font-weight: 600;" label="OFFLINE"/>}
                            </box>
                        ))}
					</box>
				</box>
			</box>
		</WidgetContainer>
	);
}
