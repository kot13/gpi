'use client'

import React from 'react'

import type { DefaultCellComponentProps } from 'payload'

const statusStyles: Record<string, string> = {
  new: 'bg-amber-100 text-amber-900',
  processed: 'bg-emerald-100 text-emerald-900',
}

const statusLabels: Record<string, string> = {
  new: 'Новая',
  processed: 'Обработана',
}

export const StatusCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  const value = String(cellData ?? '')
  const className = statusStyles[value] ?? 'bg-gray-100 text-gray-800'
  const label = statusLabels[value] ?? value

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
