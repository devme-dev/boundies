import { IMenuItem } from '../@types/components';
import MainLayout from '../layouts/Main';
import { GetServerSideProps } from 'next';
import { apiClient } from '../lib/api';
import { makeAllMenus } from '../lib/menu';
import { IBasicSettings } from '../@types/settings';

export default function AboutPage({ mainMenu, footerMenu, basicSettings }: IAboutPageProps) {
	return (
		<MainLayout
			mainMenu={mainMenu}
			footerMenu={footerMenu}
			basicSettings={basicSettings}
		>
			<div className='container'>
				<h1 className='page-heading page-heading_h1  page-heading_m-h1'>About us</h1>
				<h2>Who are we?</h2>
				<p>
					Welcome to <a href={'#'}>Boundies Store</a>, your one-stop shop for top-quality products designed to meet your needs. At Boundies Store, we are dedicated to providing the best in innovation, style, and functionality.
				</p>
				<h3>Our Story</h3>
				<p>
					Founded with a passion for excellence, Boundies Store has been committed to bringing you the finest products since our inception. We believe in the power of great design and the impact it can have on your daily life. From the early days of our journey, we have strived to offer products that blend seamlessly into your lifestyle, enhancing your everyday experiences.
				</p>
				<h4>Why Choose Us?</h4>
				<p>
					At Boundies Store, we understand that quality matters. Our products are crafted with attention to detail and are rigorously tested to ensure they meet the highest standards. We aim to provide you with items that are not only functional but also stylish and durable. Our commitment to customer satisfaction drives us to continually innovate and improve.
				</p>
				<p>
					Join us at Boundies Store, and discover a world where quality and style meet. We are here to make your life easier and more enjoyable with products you can trust. Thank you for choosing Boundies Store.
				</p>
				</div>

		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps<IAboutPageProps> = async () => {
	const categoryTree = await apiClient.catalog.getCategoryTree({ menu: 'category' });
	const { mainMenu, footerMenu } = makeAllMenus({ categoryTree });
	const basicSettings = await apiClient.system.fetchSettings(['system.locale', 'system.currency']) as IBasicSettings;

	return {
		props: {
			mainMenu,
			footerMenu,
			basicSettings
		}
	};
};

interface IAboutPageProps {
	mainMenu: IMenuItem[];
	footerMenu: IMenuItem[];
	basicSettings: IBasicSettings;
}