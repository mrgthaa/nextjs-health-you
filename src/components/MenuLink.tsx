// components/MenuLink.tsx
'use client';

import { MenuItem } from '@mui/material';
import Link from 'next/link';
import { ReactNode, MouseEventHandler } from 'react';

type MenuLinkProps = {
  href: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLLIElement>;
};

export default function MenuLink({ href, children, onClick }: MenuLinkProps) {
  return (
    <MenuItem onClick={onClick}>
      <Link
        href={href}
        style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
      >
        {children}
      </Link>
    </MenuItem>
  );
}
