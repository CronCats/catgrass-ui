import { ComponentType, ReactNode } from 'react'

import { LogoNoBorder, LogoProps } from './Logo'

export interface GradientWrapperProps {
  Logo?: ComponentType<LogoProps>
  children: ReactNode
}

export const GradientWrapper = ({
  Logo = LogoNoBorder,
  children,
}: GradientWrapperProps) => (
  <div className="flex overflow-x-hidden relative flex-col items-center">
    {children}
  </div>
)
