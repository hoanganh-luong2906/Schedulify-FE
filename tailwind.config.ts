import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/commons/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				primary: {
					'50': 'var(--primary-light)',
					'100': 'var(--primary-light-hover)',
					'200': 'var(--primary-light-active)',
					'300': 'var(--primary-normal)',
					'400': 'var(--primary-normal-hover)',
					'500': 'var(--primary-normal-active)',
					'600': 'var(--primary-dark)',
					'700': 'var(--primary-dark-hover)',
					'800': 'var(--primary-dark-active)',
					'900': 'var(--primary-darker)',
				},
				secondary: {
					light: 'var(--secondary-light)',
					'light-hover': 'var(--secondary-light-hover)',
					'light-active': 'var(--secondary-light-active)',
					normal: 'var(--secondary-normal)',
					'normal-hover': 'var(--secondary-normal-hover)',
					'normal-active': 'var(--secondary-normal-active)',
					dark: 'var(--secondary-dark)',
					'dark-hover': 'var(--secondary-dark-hover)',
					'dark-active': 'var(--secondary-dark-active)',
					darker: 'var(--secondary-darker)',
				},
				tertiary: {
					light: 'var(--tertiary-light)',
					'light-hover': 'var(--tertiary-light-hover)',
					'light-active': 'var(--tertiary-light-active)',
					normal: 'var(--tertiary-normal)',
					'normal-hover': 'var(--tertiary-normal-hover)',
					'normal-active': 'var(--tertiary-normal-active)',
					dark: 'var(--tertiary-dark)',
					'dark-hover': 'var(--tertiary-dark-hover)',
					'dark-active': 'var(--tertiary-dark-active)',
					darker: 'var(--tertiary-darker)',
				},
				basic: {
					gray: 'var(--basic-gray)',
					'gray-hover': 'var(--basic-gray-hover)',
					'gray-active': 'var(--basic-gray-active)',
					positive: 'var(--basic-positive)',
					'positive-hover': 'var(--basic-positive-hover)',
					negative: 'var(--basic-negative)',
					'negative-hover': 'var(--basic-negative-hover)',
				},
			},
			borderWidth: {
				1: '1px',
				2: '2px',
				3: '3px',
				4: '4px',
				5: '5px',
				6: '6px',
				7: '7px',
				8: '8px',
				9: '9px',
				10: '10px',
			},
			fontSize: {
				// Title-variants
				'title-3xl': [
					'var(--font-size-66)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '400',
					},
				],
				'title-2xl': [
					'var(--font-size-52)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '400',
					},
				],
				'title-1.5xl': [
					'var(--font-size-32)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '400',
					},
				],
				'title-xl': [
					'var(--font-size-26)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '400',
					},
				],
				'title-large': [
					'var(--font-size-23)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '400',
					},
				],
				'title-medium': [
					'var(--font-size-20)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '400',
					},
				],
				'title-small': [
					'var(--font-size-18)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '400',
					},
				],

				'title-3xl-strong': [
					'var(--font-size-66)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '600',
					},
				],
				'title-2xl-strong': [
					'var(--font-size-52)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '500',
					},
				],
				'title-1.5xl-strong': [
					'var(--font-size-32)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '500',
					},
				],
				'title-xl-strong': [
					'var(--font-size-26)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '500',
					},
				],
				'title-large-strong': [
					'var(--font-size-23)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '500',
					},
				],
				'title-medium-thin': [
					'var(--font-size-20)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '300',
					},
				],
				'title-medium-strong': [
					'var(--font-size-20)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '500',
					},
				],
				'title-small-strong': [
					'var(--font-size-18)',
					{
						letterSpacing: '0.05rem',
						fontWeight: '500',
					},
				],

				// Body variants
				'body-xlarge': [
					'var(--font-size-18)',
					{
						letterSpacing: '0.025rem',
						fontWeight: '300',
					},
				],
				'body-large': [
					'var(--font-size-16)',
					{
						letterSpacing: '0.025rem',
						fontWeight: '300',
					},
				],
				'body-large-strong': [
					'var(--font-size-16)',
					{
						letterSpacing: '0.025rem',
						fontWeight: '500',
					},
				],
				'body-medium': [
					'var(--font-size-14)',
					{
						letterSpacing: '0.025rem',
						fontWeight: '300',
					},
				],
				'body-medium-strong': [
					'var(--font-size-14)',
					{
						letterSpacing: '0.025rem',
						fontWeight: '300',
					},
				],
				'body-small': [
					'var(--font-size-13)',
					{
						letterSpacing: '0.025rem',
						fontWeight: '300',
					},
				],
				'small-strong': [
					'var(--font-size-13)',
					{
						letterSpacing: '0.025rem',
						fontWeight: '300',
					},
				],
			},
			fontWeight: {
				thin: '100',
				extralight: '200',
				light: '300',
				regular: '400',
				medium: '500',
				semibold: '600',
				bold: '700',
				extrabold: '800',
				black: '900',
			},
			animation: {
				normal: '1s linear',
			},
		},
	},
	plugins: [require('tailwindcss-animated')],
};
export default config;
