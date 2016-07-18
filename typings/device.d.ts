export declare class Rs485 extends RuffDevice {
    /**
     * Turn this device on.
     * @param data - The data to be written.
     * @param callback - The callback.
     */
    write(data: Buffer, callback: (error: Error) => void): void;

    /**
     * Turn this device off.
     * @param callback - The callback.
     */
    read(callback: (error: Error) => void): void;
}

export default Rs485;
