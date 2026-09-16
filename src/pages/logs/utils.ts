
const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const pad = (n: number, z = 2) => String(n).padStart(z, '0');

    const offsetMin = -date.getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const offH = pad(Math.floor(Math.abs(offsetMin) / 60));
    const offM = pad(Math.abs(offsetMin) % 60);

    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
        )}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
        )}` +
        `.${pad(date.getMilliseconds(), 3)}${sign}${offH}:${offM}`
    );
};
//keep the last n characters, matching logback's field truncation behaviour
const truncateStart = (value: string, length: number) => value.length > length ? value.slice(value.length - length) : value;
//abbreviate package segments to their first letter, keeping the class name whole
const abbreviateLogger = (logger: string) => {
    const parts = logger.split('.');
    if (parts.length <= 1) {
        return logger;
    }
    const className = parts.pop();
    return `${parts.map(p => p.charAt(0)).join('.')}.${className}`;
};
const padLogger = (logger: string, length: number) => logger.length > length
    ? logger.slice(logger.length - length)
    : logger.padEnd(length);
//ANSI color codes matching Spring Boot's default console level colors
const LEVEL_COLORS: Record<string, string> = {
    ERROR: '\x1b[31m',
    WARN: '\x1b[33m',
    INFO: '\x1b[32m',
    DEBUG: '\x1b[32m',
    TRACE: '\x1b[32m',
};
const ANSI_RESET = '\x1b[0m';
const ANSI_FAINT = '\x1b[39m';
const colorize = (value: string, color?: string) => color ? `${color}${value}${ANSI_RESET}` : value;
export const formatLogItem = (item: any) => {
    if (!item || !item.message) {
        return '';
    }

    const timestamp = formatTimestamp(item.timestamp);
    const level = (item.level || '').padStart(5);
    const thread = truncateStart(item.thread || '', 15).padStart(15);
    const logger = padLogger(abbreviateLogger(item.logger || ''), 40);

    return (
        `${colorize(timestamp, ANSI_FAINT)} ` +
        `${colorize(level, LEVEL_COLORS[item.level])} --- ` +
        `[${colorize(thread, ANSI_FAINT)}] ` +
        `${colorize(logger, ANSI_FAINT)} : ${item.message}`
    );
};
export type LoggerEntry = { key: string; level: string; };
const LOG_LEVELS = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'];
export const LOG_LEVEL_CHOICES = LOG_LEVELS.map(level => ({
    id: level,
    name: level,
}));
