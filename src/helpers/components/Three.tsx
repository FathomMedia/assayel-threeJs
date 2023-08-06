'use client'

import { r3f } from '@/helpers/global'
import { FC, PropsWithChildren } from 'react'

export const Three: FC<PropsWithChildren> = ({ children }) => {
  return <r3f.In>{children}</r3f.In>
}
