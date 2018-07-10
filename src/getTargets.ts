import {Targets} from "pango";
import {SerialPortListTarget} from "./SerialPortListTarget";
import {SerialPortPicocomTarget} from "./SerialPortPicocomTarget";
import * as whichCallback from "which";

function which(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
        whichCallback(file, (err, path) => {
            if (err) {
                return reject(err);
            }
            return resolve(path);
        });
    });
}

export async function getSerialPortTargets(): Promise<Targets> {
    const targets = {
        'serialport-list': new SerialPortListTarget()
    };
    if (await which('picocom')) {
        targets['serialport-picocom'] = new SerialPortPicocomTarget();
    }
    return targets;
}
