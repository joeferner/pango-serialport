import {ProjectOptions, Target, Targets} from "pango";
import {getSerialPortOptionsPromptingForMissing, SerialPortParity} from "./SerialPortOptions";
import {spawn} from "child_process";

export class SerialPortPicocomTarget implements Target {
    helpMessage = 'Starts Picocom';

    async run(projectOptions: ProjectOptions): Promise<void | Targets | string[]> {
        const options = await getSerialPortOptionsPromptingForMissing(projectOptions);
        if (!options) {
            console.error('Aborted');
            return;
        }
        const parity = options.parity == SerialPortParity.EVEN
            ? 'e'
            : options.parity == SerialPortParity.ODD
                ? 'o'
                : 'n';
        const args = [
            '-b', `${options.baudRate}`,
            '-f', 'n',
            '-d', `${options.dataBits}`,
            '-y', parity,
            '-p', `${options.stopBits}`,
            '--echo',
            '--imap',
            'lfcrlf',
            options.deviceName
        ];
        spawn('picocom', args, {
            stdio: 'inherit'
        });
    }
}
