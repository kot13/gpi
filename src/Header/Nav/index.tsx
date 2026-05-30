'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { Nav } from '@/components/layout/Nav'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  return <Nav items={data?.navItems} className="flex gap-3 items-center" />
}
