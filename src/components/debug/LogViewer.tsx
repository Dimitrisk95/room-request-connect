
import React, { useState } from 'react'
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card'
import { ModernButton } from '@/components/ui/modern-button'
import { logger } from '@/utils/logger'
import { Download, Trash2, RefreshCw, Filter, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export const LogViewer: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all')
  const [isVisible, setIsVisible] = useState(false)

  const logs = selectedLevel === 'all' ? logger.getLogs() : logger.getLogs(selectedLevel)

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      case 'debug': return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'error': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'warn': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'debug': return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const exportLogs = () => {
    const logData = logger.exportLogs()
    const blob = new Blob([logData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roomlix-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <ModernButton
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
        >
          View Logs ({logs.length})
        </ModernButton>
      </div>
    )
  }

  return (
    <div className="fixed inset-4 z-50 flex items-center justify-center">
      <div className="w-full max-w-4xl h-full max-h-[80vh]">
        <ModernCard className="h-full flex flex-col">
          <ModernCardHeader>
            <div className="flex items-center justify-between">
              <ModernCardTitle>System Logs</ModernCardTitle>
              <div className="flex gap-2">
                <ModernButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                >
                  Close
                </ModernButton>
              </div>
            </div>
            
            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex gap-1">
                {['all', 'error', 'warn', 'info', 'debug'].map((level) => (
                  <ModernButton
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(level as LogLevel | 'all')}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {level}
                  </ModernButton>
                ))}
              </div>
              
              <ModernButton
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </ModernButton>
              
              <ModernButton
                variant="outline"
                size="sm"
                onClick={exportLogs}
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </ModernButton>
              
              <ModernButton
                variant="destructive"
                size="sm"
                onClick={() => {
                  logger.clearLogs()
                  window.location.reload()
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </ModernButton>
            </div>
          </ModernCardHeader>
          
          <ModernCardContent className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto space-y-2">
              {logs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No logs available
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    {getLevelIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getLevelColor(log.level)}>
                          {log.level}
                        </Badge>
                        {log.component && (
                          <Badge variant="outline">
                            {log.component}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{log.message}</p>
                      {log.data && (
                        <pre className="text-xs text-muted-foreground mt-2 p-2 bg-black/20 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>
    </div>
  )
}
