'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { inter } from '@/utils/fonts';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IConstraintsSidenavData } from '../_libs/constants';

interface IConstraintsSidenavProps {
	data: IConstraintsSidenavData[];
}
const ConstraintsSidenav = (props: IConstraintsSidenavProps) => {
	const { data } = props;
	const pathName = usePathname();
	const router = useRouter();
	const currentPath = pathName.split('/')[4];

	const [expanded, setExpanded] = useState<string[]>(['panel0', 'panel1']);

	const toggleDropdown =
		(panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
			if (newExpanded) {
				setExpanded((prev: string[]) => [...prev, panel]);
			} else {
				setExpanded((prev: string[]) => prev.filter((item) => item !== panel));
			}
		};

	const handleSelectConstraint = (constraint: string) => {
		router.replace(constraint);
	};

	return (
		<div className='w-[22%] h-[90vh] flex flex-col justify-start items-start border-r-1 border-gray-200'>
			<h1 className='text-title-small-strong w-full pl-3 py-3 text-left'>
				Danh sách ràng buộc
			</h1>
			{data.length === 0 ? (
				<p className='text-body-medium w-full pl-3 py-3 text-left italic'>
					Chưa có dữ liệu ràng buộc
				</p>
			) : (
				<div
					className={`w-[100%] h-fit flex flex-row justify-start items-center py-2 pl-6 pr-3 select-none gap-5 hover:cursor-pointer 
								${
									currentPath === 'general-configurations'
										? 'bg-basic-gray-active '
										: 'hover:bg-basic-gray-hover'
								}`}
					onClick={() => handleSelectConstraint('general-configurations')}
				>
					<p
						className={`text-body-medium font-normal w-full ${
							currentPath === 'general-configurations' ? ' !font-semibold' : ''
						}`}
					>
						Cấu hình chung
					</p>
				</div>
			)}
			{data.map((item: IConstraintsSidenavData, index) => (
				<Accordion
					expanded={expanded.includes(`panel${index}`)}
					onChange={toggleDropdown(`panel${index}`)}
					className='w-full h-fit !p-0 !m-0'
					key={item.category + index}
					sx={{
						boxShadow: 'none', // Remove the box-shadow
						'&:before': {
							content: '""',
							display: 'block',
							backgroundColor: '#e0e0e0', // Keep the divider line with a light gray color
						},
					}}
				>
					<AccordionSummary
						aria-controls={`panel${index}d-content`}
						id={`panel${index}d-header`}
						className='!text-black !bg-basic-gray-hover !m-0 !py-0 !h-[10px]'
					>
						<Typography className='!text-body-large-strong py-1'>
							{item.category}
						</Typography>
					</AccordionSummary>
					<AccordionDetails className='!w-full h-fit !p-0'>
						{item.items.map((subItem: IDropdownOption<string>, id: number) => (
							<div
								key={subItem.label + id}
								className={`w-[100%] h-fit flex flex-row justify-start items-center py-2 pl-6 pr-3 gap-5 hover:cursor-pointer 
									${currentPath === subItem.value ? 'bg-basic-gray-active ' : 'hover:bg-basic-gray-hover'}`}
								onClick={() => handleSelectConstraint(subItem.value)}
							>
								<p
									className={`${
										inter.className
									} antialiased text-body-medium font-normal opacity-90 ${
										currentPath === subItem.value ? ' !font-medium' : ''
									}`}
								>
									{subItem.label}
								</p>
							</div>
						))}
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
};

export default ConstraintsSidenav;
