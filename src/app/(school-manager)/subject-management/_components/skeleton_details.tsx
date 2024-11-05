import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, Skeleton, Typography } from '@mui/material';

const SubjectDetailsSkeleton = () => {
	return (
		<div
			className={`h-full w-[35%] flex flex-col justify-start items-center pt-[2vh] border-l-2 border-basic-gray-active ${'visible animate-fade-left animate-once animate-duration-500 animate-ease-out'}`}
		>
			<div className='w-full flex flex-row justify-between items-center pb-1 px-5'>
				<Typography
					variant='h6'
					className='text-title-small-strong font-normal w-full text-left'
				>
					Thông tin môn học
				</Typography>
				<IconButton className='translate-x-2'>
					<CloseIcon />
				</IconButton>
			</div>
			<Divider variant='middle' orientation='horizontal' sx={{ width: '100%' }} />
			<div className='w-full h-fit p-5 flex flex-col justify-start items-start gap-3'>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Tên môn học</h4>
					<Skeleton animation='wave' variant='text' sx={{ width: '50%', height: 30 }} />
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Mã môn</h4>
					<Skeleton animation='wave' variant='text' sx={{ width: '50%', height: 30 }} />
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Tổ bộ môn</h4>
					<Skeleton animation='wave' variant='text' sx={{ width: '50%', height: 30 }} />
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Loại môn học</h4>
					<Skeleton animation='wave' variant='text' sx={{ width: '50%', height: 30 }} />
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Ngày tạo</h4>
					<Skeleton animation='wave' variant='text' sx={{ width: '50%', height: 30 }} />
				</div>
				<Divider
					variant='middle'
					orientation='horizontal'
					sx={{ width: '90%', marginTop: '2vh' }}
				/>
			</div>
		</div>
	);
};

export default SubjectDetailsSkeleton;