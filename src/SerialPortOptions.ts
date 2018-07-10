import {ProjectOptions} from "pango";
import * as prompts from "prompts";
import * as serialport from "serialport";

export enum SerialPortParity {
    ODD = 'odd',
    EVEN = 'even',
    NONE = 'none'
}

export interface SerialPortOptions {
    deviceName?: string;
    baudRate?: number;
    dataBits?: number;
    parity?: SerialPortParity;
    stopBits?: number;
}

export function getSerialPortOptions(projectOptions: ProjectOptions): SerialPortOptions {
    return projectOptions.serialport = {
        ...(projectOptions.serialport)
    };
}

export async function getSerialPortOptionsPromptingForMissing(projectOptions: ProjectOptions, requiredOptions?: string[]): Promise<SerialPortOptions> {
    const options = getSerialPortOptions(projectOptions);
    requiredOptions = requiredOptions || ['deviceName', 'baudRate', 'dataBits', 'parity', 'stopBits'];
    for (let requiredOption of requiredOptions) {
        if (options[requiredOption]) {
            continue;
        }
        switch (requiredOption) {
            case 'deviceName':
                options.deviceName = await getDeviceName();
                if (!options.deviceName) {
                    return undefined;
                }
                break;
            case 'baudRate':
                options.baudRate = await getBaudRate();
                if (!options.baudRate) {
                    return undefined;
                }
                break;
            case 'dataBits':
                options.dataBits = await getBits();
                if (!options.dataBits) {
                    return undefined;
                }
                break;
            case 'parity':
                options.parity = await getParity();
                if (!options.parity) {
                    return undefined;
                }
                break;
            case 'stopBits':
                options.stopBits = await getStopBits();
                if (!options.stopBits) {
                    return undefined;
                }
                break;
            default:
                throw new Error(`Unhandle option "${requiredOption}"`);
        }
    }
    return options;
}

async function getDeviceName(): Promise<string> {
    const ports = await serialport.list();
    const choices = ports.map(port => {
        return {
            title: `${port.comName}\t${port.pnpId || ''}\t${port.manufacturer || ''}`,
            value: port.comName
        };
    });
    choices.push({
        title: 'Other'
    });
    let response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Device',
        choices: choices
    });
    if (!('value' in response)) {
        return undefined;
    }
    if (response.value) {
        return response.value;
    }

    response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Device path'
    });
    return response.value;
}

async function getBaudRate(): Promise<number> {
    const response = await prompts({
        type: 'number',
        name: 'value',
        message: 'Baud Rate',
        initial: 19200
    });
    return response.value;
}

async function getBits(): Promise<number> {
    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Bits',
        choices: [
            {title: '5', value: 5},
            {title: '6', value: 6},
            {title: '7', value: 7},
            {title: '8', value: 8}
        ],
        initial: 3
    });
    return response.value;
}

async function getParity(): Promise<SerialPortParity> {
    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Partity',
        choices: [
            {title: 'Odd', value: 'odd'},
            {title: 'Even', value: 'even'},
            {title: 'None', value: 'none'}
        ],
        initial: 2
    });
    return response.value;
}

async function getStopBits(): Promise<number> {
    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Stop bits',
        choices: [
            {title: '1', value: 1},
            {title: '2', value: 2}
        ],
        initial: 0
    });
    return response.value;
}
