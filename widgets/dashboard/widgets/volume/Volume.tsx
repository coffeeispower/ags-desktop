import { Gtk } from 'astal/gtk3';
import { WidgetContainer } from '../../WidgetContainer';
import { bind, Variable } from 'astal';
import Wp from 'gi://AstalWp';
const volume = Variable(50); // Initial volume set to 50%

function setVolume(value: number) {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!;
    speaker.volume = value / 100;
	volume.set(value);
}

export function VolumeWidget() {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!;
	return (
		<WidgetContainer className="volume-widget">
			<box className="widget-header" spacing={24} hexpand>
				<icon
					icon={bind(speaker, 'volumeIcon')}
					halign={Gtk.Align.START}
					valign={Gtk.Align.BASELINE}
					className={'widget-icon widget-icon-volume'}
				/>
			</box>
			<box hexpand vertical className={'widget-body'}>
				<slider
					onValueChanged={scale => setVolume(scale.value)}
                    value={bind(speaker, "volume").as((v) => v * 100)}
					vexpand
					vertical
					inverted
					drawValue={false}
					adjustment={
						new Gtk.Adjustment({
							lower: 0,
							upper: 100,
							stepIncrement: 1,
						})
					}
				/>
				<label
					xalign={0.5}
					className="indicator"
					css={'opacity: 0.7; margin: 1.8rem 0;'}
					label={volume(volume => `${Math.round(volume)}%`)}
				/>
			</box>
		</WidgetContainer>
	);
}
