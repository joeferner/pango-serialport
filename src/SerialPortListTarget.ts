import {ProjectOptions, Target, Targets} from "pango";
import * as serialport from "serialport";

export class SerialPortListTarget implements Target {
    helpMessage = "Lists the available serial ports";

    async run(projectOptions: ProjectOptions): Promise<void | Targets | string[]> {
        const ports = await serialport.list();
        ports.forEach((port) => {
            console.log(`${port.comName}\t${port.pnpId || ''}\t${port.manufacturer || ''}`);
        });
    }
}
