import { ComponentType, ReactNode } from 'react'

import { LogoProps } from './Logo'

export interface GradientWrapperProps {
  Logo?: ComponentType<LogoProps>
  children: ReactNode
}

export const GradientWrapper = ({ children }: GradientWrapperProps) => (
  <div className="flex overflow-x-hidden relative flex-col items-center">
    {children}
  </div>
)
