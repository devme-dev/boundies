import { IMenuItem } from '../@types/components';
import MainLayout from '../layouts/Main';
import { GetServerSideProps } from 'next';
import { apiClient } from '../lib/api';
import { makeAllMenus } from '../lib/menu';
import { IBasicSettings } from '../@types/settings';

export default function ShippingPage({ mainMenu, footerMenu, basicSettings }: IShippingPageProps) {
	return (
		<MainLayout
			mainMenu={mainMenu}
			footerMenu={footerMenu}
			basicSettings={basicSettings}
		>
			<div className='container'>
				<h1 className='page-heading page-heading_h1  page-heading_m-h1'>Shipping</h1>
				<h2>Shipping Information</h2>
				<p>
					At <a href={'#'}>Boundies Store</a>, we strive to provide a seamless and efficient shipping experience for our customers. Our shipping policies are designed to ensure that your orders are delivered promptly and safely.
				</p>
				<h3>Shipping Methods and Rates</h3>
				<p>
					We offer a variety of shipping options to meet your needs. Our standard shipping is available at a flat rate, and we also offer expedited shipping for an additional fee. All shipping rates are calculated based on the weight and destination of your order, ensuring that you receive the best possible service at a competitive price.
				</p>
				<h4>Order Processing Time</h4>
				<p>
					Once your order is placed, our team works diligently to process and ship it within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day. You will receive a confirmation email with tracking information once your order has been shipped.
				</p>
				<h4>International Shipping</h4>
				<p>
					Boundies Store is proud to offer international shipping to many countries worldwide. International shipping rates and delivery times vary based on the destination. Please note that customs fees and import duties may apply, and customers are responsible for these charges.
				</p>
				<h4>Tracking Your Order</h4>
				<p>
					We provide tracking information for all orders, allowing you to monitor the status of your shipment from the moment it leaves our warehouse to its arrival at your doorstep. Simply use the tracking number provided in your confirmation email to check the progress of your delivery.
				</p>
				<h4>Shipping FAQs</h4>
				<p>
					For any additional questions regarding our shipping policies, please visit our <a href={'#'}>FAQ page</a> or contact our customer service team. We are here to assist you and ensure that your shopping experience at Boundies Store is exceptional.
				</p>

			</div>
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps<IShippingPageProps> = async () => {
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

interface IShippingPageProps {
	mainMenu: IMenuItem[];
	footerMenu: IMenuItem[];
	basicSettings: IBasicSettings;
}