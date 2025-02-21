import AstalBattery from "gi://AstalBattery?version=0.1";
import Gtk from "gi://Gtk?version=3.0";
import {bind, Variable} from "astal";

const battery = AstalBattery.get_default();

export default function BatteryIndicator() {
    return <box halign={Gtk.Align.CENTER} spacing={8} marginRight={40}>
        <icon icon={bind(Variable("").poll(1000, () => battery.batteryIconName))}
              iconSize={Gtk.IconSize.SMALL_TOOLBAR}/>
        {bind(Variable(0).poll(1000, () => battery.percentage)).as((p) => `${(p * 100).toFixed(0)}%`)}
    </box>;
}
