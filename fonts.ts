import localFont from 'next/font/local'

export const agrandir = localFont({
  src: [
    {
      path: './public/fonts/Agrandir-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './public/fonts/Agrandir-Narrow.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './public/fonts/Agrandir-TextBold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-agrandir',
})