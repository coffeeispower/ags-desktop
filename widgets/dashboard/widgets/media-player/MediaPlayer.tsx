import { Astal, Gtk } from 'astal/gtk3';
import Mpris from 'gi://AstalMpris';
import { bind } from 'astal';
import { WidgetContainer } from '../../WidgetContainer';
import { DASHBOARD_IS_OPEN } from '../../DashboardScreen';
import { hyprland } from '../../../../utils/hyprland';
import Pango from 'gi://Pango?version=1.0';

function lengthStr(length: number) {
	const min = Math.floor(length / 60);
	const sec = Math.floor(length % 60);
	const sec0 = sec < 10 ? '0' : '';
	return `${min}:${sec0}${sec}`;
}

function MediaPlayer({ player }: { player: Mpris.Player }) {
	const { START, END } = Gtk.Align;

	const title = bind(player, 'title').as(t => t || 'Unknown Track');

	const artist = bind(player, 'artist').as(a => a || 'Unknown Artist');

	const coverArt = bind(player, 'coverArt').as(
		c => `background-image: url('${c}');`,
	);

	const playerIcon = bind(player, 'entry').as(e =>
		Astal.Icon.lookup_icon(e) ? e : 'audio-x-generic-symbolic',
	);

	const position = bind(player, 'position').as(p =>
		player.length > 0 ? p / player.length : 0,
	);

	const playIcon = bind(player, 'playbackStatus').as(s =>
		s === Mpris.PlaybackStatus.PLAYING
			? 'media-playback-pause-symbolic'
			: 'media-playback-start-symbolic',
	);

	return (
		<WidgetContainer className="media-player">
			<button
				className="cover-art"
				css={coverArt}
				halign={Gtk.Align.CENTER}
				hexpand={false}
				cursor={"pointer"}
				onClicked={() => {
					const spotifyWindow = hyprland.clients.find(c => c.class === 'spotify');
					if(!spotifyWindow) return;
					DASHBOARD_IS_OPEN.set(false);
					spotifyWindow.focus();
				}}
			/>
			<box valign={Gtk.Align.CENTER} vertical>
				<label
					className="title"
					truncate
					maxWidthChars={18}
					ellipsize={Pango.EllipsizeMode.END}
					hexpand
					halign={START}
					label={title}
				/>
				<label halign={START} valign={START} vexpand wrap label={artist} />
			</box>
			<slider
				visible={bind(player, 'length').as(l => l > 0)}
				onDragged={({ value }) => {
					player.position = value * player.length;
				}}
				value={position}
			/>
			<centerbox>
				<label
					hexpand
					className="position"
					halign={START}
					visible={bind(player, 'length').as(l => l > 0)}
					label={bind(player, 'position').as(lengthStr)}
				/>
				<box />
				<label
					className="length"
					hexpand
					halign={END}
					visible={bind(player, 'length').as(l => l > 0)}
					label={bind(player, 'length').as(l =>
						l > 0 ? lengthStr(l) : '0:00',
					)}
				/>
			</centerbox>
			<box className="actions" halign={Gtk.Align.CENTER} spacing={8}>
				<button
					onClicked={() => player.previous()}
					className={'previous'}
					visible={bind(player, 'canGoPrevious')}
				>
					<icon icon="media-skip-backward-symbolic" />
				</button>
				<button
					onClicked={() => player.play_pause()}
					className={'play-pause'}
					visible={bind(player, 'canControl')}
				>
					<icon icon={playIcon} />
				</button>
				<button
					onClicked={() => player.next()}
					className={'next'}
					visible={bind(player, 'canGoNext')}
				>
					<icon icon="media-skip-forward-symbolic" />
				</button>
			</box>
		</WidgetContainer>
	);
}

export default function MprisPlayers() {
	const mpris = Mpris.get_default();
	return (
		<>
			{bind(mpris, 'players').as(arr =>
				arr.filter((player) => (player.busName === "org.mpris.MediaPlayer2.spotify")).map(player => <MediaPlayer player={player} />),
			)}
		</>
	);
}
