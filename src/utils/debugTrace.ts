import { enableDebugTrace } from "../config/config";

export default function debugTrace (fname, step, msg, localEnable = true) {
    if (enableDebugTrace && localEnable) {
        console.log(
            `
            Function: ${fname}
            Step: ${step}
            Message: ${msg}
            `
        )
    }
}