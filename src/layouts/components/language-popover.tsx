import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

// ----------------------------------------------------------------------

// 1. LISTA DE IDIOMAS DEFINIDA DIRETAMENTE NO ARQUIVO
const LANGUAGES = [
  {
    value: 'pt-BR',
    label: 'Português (BR)',
    icon: 'https://cdn.jsdelivr.net/gh/circle-flags/circle-flags/flags/br.svg',
  },
  {
    value: 'en',
    label: 'English',
    icon: 'https://cdn.jsdelivr.net/gh/circle-flags/circle-flags/flags/gb.svg',
  },
  {
    value: 'es',
    label: 'Spanish',
    icon: 'https://cdn.jsdelivr.net/gh/circle-flags/circle-flags/flags/es.svg',
  },
];

// ----------------------------------------------------------------------

export type LanguagePopoverProps = IconButtonProps & {
  data?: {
    value: string;
    label: string;
    icon: string;
  }[];
};

export function LanguagePopover({ data = LANGUAGES, sx, ...other }: LanguagePopoverProps) { // 2. USANDO A LISTA COMO PADRÃO
  const { open, anchorEl, onClose, onOpen } = usePopover();

  // 3. INICIALIZAÇÃO SEGURA DO IDIOMA
  const [locale, setLocale] = useState(data?.[0]?.value ?? 'pt-BR');

  const handleChangeLang = useCallback(
    (newLang: string) => {
      setLocale(newLang);
      onClose();
      // Aqui você pode adicionar a lógica para mudar o idioma da aplicação
    },
    [onClose]
  );

  const currentLang = data.find((lang) => lang.value === locale);

  const renderFlag = (label?: string, icon?: string) => (
    <Box
      component="img"
      alt={label}
      src={icon}
      sx={{ width: 26, height: 20, borderRadius: 0.5, objectFit: 'cover' }}
    />
  );

  const renderMenuList = () => (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuList
        sx={{
          p: 0.5,
          gap: 0.5,
          width: 160,
          minHeight: 72,
          display: 'flex',
          flexDirection: 'column',
          [`& .${menuItemClasses.root}`]: {
            px: 1,
            gap: 2,
            borderRadius: 0.75,
            [`&.${menuItemClasses.selected}`]: {
              bgcolor: 'action.selected',
              fontWeight: 'fontWeightSemiBold',
            },
          },
        }}
      >
        {data?.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang?.value}
            onClick={() => handleChangeLang(option.value)}
          >
            {renderFlag(option.label, option.icon)}
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Popover>
  );

  return (
    <>
      <IconButton
        aria-label="Languages button"
        onClick={onOpen}
        sx={[
          (theme) => ({
            p: 0,
            width: 40,
            height: 40,
            ...(open && { bgcolor: theme.vars.palette.action.selected }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {renderFlag(currentLang?.label, currentLang?.icon)}
      </IconButton>

      {renderMenuList()}
    </>
  );
}