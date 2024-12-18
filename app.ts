import { App } from "astal/gtk3"
import style from "./style.scss"
import { Workspaces } from "./widget/Workspaces"

App.start({
    css: style,
    main() {
        App.get_monitors().map((monitor) => {
            Workspaces(monitor);
        })
    },
})
