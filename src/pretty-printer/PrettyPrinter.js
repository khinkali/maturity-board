export default class PrettyPrinter {

    static get DATE_FORMAT() {
        return 'yyyy-MM-DD HH:mm:ss:SSS';
    }

    prettyPrintPercent(percent) {
        return `${Math.trunc(100 * percent)}%`;
    }

    prettyPrintTime(timeInMs) {
        timeInMs = Math.trunc(timeInMs);
        if (timeInMs < 1000) {
            return `${timeInMs}ms`;
        }
        let seconds = Math.trunc(timeInMs / 1000);
        const ms = Math.trunc(timeInMs % 1000);
        if (seconds < 60) {
            return `${seconds}s${this.getMs(ms)}`;
        }
        let min = Math.trunc(seconds / 60);
        seconds = Math.trunc(seconds % 60);
        if (min < 60) {
            return `${min}min ${this.getSecond(seconds)}${this.getMs(ms)}`;
        }
        let h = Math.trunc(min / 60);
        min = Math.trunc(min % 60);
        if (h < 24) {
            return `${h}h ${this.getMin(min)}${this.getSecond(seconds)}`;
        }
        let day = Math.trunc(h / 24);
        h = Math.trunc(h % 24);
        return `${day}d ${this.getH(h)}${this.getMin(min)}`;
    }

    getH(h) {
        if (h === 0) {
            return '';
        } else {
            return ` ${h}h`;
        }
    }

    getMin(min) {
        if (min === 0) {
            return '';
        } else {
            return ` ${min}min`;
        }
    }

    getSecond(seconds) {
        if (seconds === 0) {
            return '';
        } else {
            return ` ${seconds}s`;
        }
    }

    getMs(ms) {
        if (ms === 0) {
            return '';
        } else {
            return ` ${ms}ms`;
        }
    }

}