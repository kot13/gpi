import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps === 'high'

  return (
    <Image
      alt="GPI — Georgia Private Investment"
      width={1677}
      height={697}
      loading={loading}
      priority={priority}
      className={clsx('h-[34px] w-auto max-w-[9.375rem]', className)}
      src="/images/gpi-logo.png"
    />
  )
}
