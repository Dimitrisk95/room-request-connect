
import { useToast } from "@/hooks/use-toast"

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  data?: any
  component?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private addLog(level: LogLevel, message: string, data?: any, component?: string) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      component
    }
    
    this.logs.unshift(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Console logging with better formatting
    const prefix = `[${level.toUpperCase()}] ${component ? `[${component}] ` : ''}`
    const logMethod = level === 'error' ? console.error : 
                     level === 'warn' ? console.warn : 
                     level === 'debug' ? console.debug : console.log

    if (data) {
      logMethod(prefix + message, data)
    } else {
      logMethod(prefix + message)
    }
  }

  info(message: string, data?: any, component?: string) {
    this.addLog('info', message, data, component)
  }

  warn(message: string, data?: any, component?: string) {
    this.addLog('warn', message, data, component)
  }

  error(message: string, data?: any, component?: string) {
    this.addLog('error', message, data, component)
  }

  debug(message: string, data?: any, component?: string) {
    this.addLog('debug', message, data, component)
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return this.logs
  }

  clearLogs() {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const logger = new Logger()

// React hook for using logger with toast notifications
export const useLogger = () => {
  const { toast } = useToast()

  const logWithToast = {
    info: (message: string, data?: any, component?: string) => {
      logger.info(message, data, component)
      toast({
        title: "Info",
        description: message,
      })
    },
    warn: (message: string, data?: any, component?: string) => {
      logger.warn(message, data, component)
      toast({
        title: "Warning",
        description: message,
        variant: "destructive",
      })
    },
    error: (message: string, data?: any, component?: string) => {
      logger.error(message, data, component)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    },
    debug: (message: string, data?: any, component?: string) => {
      logger.debug(message, data, component)
    }
  }

  return {
    ...logWithToast,
    getLogs: logger.getLogs.bind(logger),
    clearLogs: logger.clearLogs.bind(logger),
    exportLogs: logger.exportLogs.bind(logger)
  }
}
