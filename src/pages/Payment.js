import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import {
  FaCreditCard,
  FaLock,
  FaCheckCircle,
  FaArrowLeft,
  FaCalendarAlt,
  FaShieldAlt,
  FaShoppingCart,
  FaCcVisa,
  FaCcMastercard,
  FaQuestionCircle,
  FaInfoCircle,
  FaRocket
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PaymentContainer = styled(motion.div)`
  min-height: 100vh;
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 4rem;
  text-align: left;
  
  h1 {
    font-size: 3.5rem;
    font-weight: 950;
    margin-bottom: 1rem;
    background: ${props => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const OrderSummary = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 3rem;
  border-radius: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  img {
    width: 100px;
    height: 100px;
    border-radius: 20px;
    object-fit: cover;
  }

  .info {
    flex: 1;
    h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: ${props => props.theme.colors.textSecondary};
      font-size: 0.9rem;
    }
  }

  .price {
    font-weight: 800;
    font-size: 1.2rem;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  color: ${props => props.isTotal ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-weight: ${props => props.isTotal ? 900 : 500};
  font-size: ${props => props.isTotal ? '1.8rem' : '1.1rem'};
  margin-top: ${props => props.isTotal ? '2rem' : '0'};
  padding-top: ${props => props.isTotal ? '2rem' : '0'};
  border-top: ${props => props.isTotal ? `2px solid ${props.theme.colors.border}` : 'none'};
`;

const PaymentSection = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 4rem;
  border-radius: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.xl};
`;

const CardPreview = styled(motion.div)`
  width: 100%;
  height: 260px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 25px;
  padding: 2.5rem;
  color: white;
  position: relative;
  margin-bottom: 4rem;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  overflow: hidden;

  .chip {
    width: 50px;
    height: 40px;
    background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
    border-radius: 8px;
    margin-bottom: 2.5rem;
  }

  .number {
    font-size: 1.8rem;
    letter-spacing: 4px;
    font-family: 'OCR A Extended', monospace;
    margin-bottom: 2.5rem;
    height: 2.5rem;
  }

  .details {
    display: flex;
    justify-content: space-between;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 2px;
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  label {
    font-weight: 700;
    font-size: 0.95rem;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  input {
    background: ${props => props.theme.colors.background};
    border: 2px solid ${props => props.theme.colors.border};
    padding: 1.2rem;
    border-radius: 15px;
    color: ${props => props.theme.colors.text};
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}11;
      outline: none;
    }
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const PayButton = styled(motion.button)`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  box-shadow: 0 20px 40px ${props => props.theme.colors.primary}44;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TrustSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
  opacity: 0.5;
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
`;

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setCourse({
        id,
        title: 'Full Stack Titan Masterclass',
        price: 89.99,
        instructor: 'Alex Rivera',
        image: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format'
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      const sanitized = value.replace(/\D/g, '');
      // Handle backspacing over spaces
      if (formData.cardNumber.length > value.length && formData.cardNumber.endsWith(' ')) {
        value = sanitized.slice(0, -1);
      } else {
        value = sanitized.replace(/(\d{4})/g, '$1 ').trim();
      }
      value = value.slice(0, 19);
    }

    if (name === 'expiry') {
      const sanitized = value.replace(/\D/g, '');
      if (sanitized.length >= 1) {
        let month = sanitized.slice(0, 2);
        let year = sanitized.slice(2, 4);

        // Auto-prefix 0 for months 2-9
        if (month.length === 1 && parseInt(month) > 1) {
          month = '0' + month;
        }
        // Validate month
        if (month.length === 2) {
          if (parseInt(month) > 12) month = '12';
          if (parseInt(month) === 0) month = '01';
        }

        // Handle backspacing over the slash
        if (formData.expiry.length === 3 && value.length === 2 && formData.expiry.endsWith('/')) {
          value = month.slice(0, 1);
        } else if (sanitized.length >= 2) {
          value = `${month}/${year}`;
        } else {
          value = month;
        }
      } else {
        value = '';
      }
      value = value.slice(0, 5);
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigate('/dashboard');
    }, 3000);
  };

  if (loading) return null;

  const tax = course.price * 0.1;
  const total = course.price + tax;

  return (
    <PaymentContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Header>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: theme.colors.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>
          <FaArrowLeft /> Back to Details
        </button>
        <h1>Secure Checkout</h1>
      </Header>

      <CheckoutGrid>
        <OrderSummary>
          <SectionTitle><FaShoppingCart /> Review Order</SectionTitle>
          <CartItem>
            <img src={course.image} alt={course.title} />
            <div className="info">
              <h3>{course.title}</h3>
              <p>by {course.instructor}</p>
              <p>Lifetime Access • 24/7 Support</p>
            </div>
            <div className="price">${course.price}</div>
          </CartItem>

          <PriceRow>
            <span>Subtotal</span>
            <span>${course.price.toFixed(2)}</span>
          </PriceRow>
          <PriceRow>
            <span>Platform Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </PriceRow>
          <PriceRow isTotal>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </PriceRow>

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: `${theme.colors.primary}11`, borderRadius: '20px', display: 'flex', gap: '1rem', color: theme.colors.textSecondary }}>
            <FaInfoCircle style={{ color: theme.colors.primary, flexShrink: 0, marginTop: '3px' }} />
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>You will get immediate access to all course materials upon successful payment. A digital receipt will be sent to your email.</p>
          </div>
        </OrderSummary>

        <PaymentSection>
          <SectionTitle><FaCreditCard /> Payment Details</SectionTitle>

          <CardPreview
            animate={{ rotateY: isCvvFocused ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {!isCvvFocused ? (
              <div style={{ position: 'relative', height: '100%', zIndex: 1 }}>
                <div className="chip"></div>
                <div className="number">{formData.cardNumber || '•••• •••• •••• ••••'}</div>
                <div className="details">
                  <div>
                    <div style={{ opacity: 0.6, fontSize: '0.6rem', marginBottom: '0.4rem' }}>Card Holder</div>
                    <div style={{ fontSize: '1rem' }}>{formData.cardName || 'YOUR NAME'}</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.6, fontSize: '0.6rem', marginBottom: '0.4rem' }}>Expires</div>
                    <div style={{ fontSize: '1rem' }}>{formData.expiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ transform: 'rotateY(180deg)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ height: '50px', background: 'black', margin: '0 -2.5rem 2rem', opacity: 0.8 }}></div>
                <div style={{ background: 'white', color: 'black', padding: '0.5rem 1rem', borderRadius: '5px', textAlign: 'right', fontWeight: 800, width: '80%', margin: '0 auto' }}>
                  {formData.cvv || '•••'}
                </div>
              </div>
            )}
          </CardPreview>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <label><FaCreditCard /> Card Number</label>
              <input
                name="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>Cardholder Name</label>
              <input
                name="cardName"
                placeholder="Full Name"
                value={formData.cardName}
                onChange={handleInputChange}
                required
              />
            </InputGroup>

            <Row>
              <InputGroup>
                <label><FaCalendarAlt /> Expiry Date</label>
                <input
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label><FaLock /> CVV</label>
                <input
                  name="cvv"
                  type="password"
                  placeholder="•••"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  onFocus={() => setIsCvvFocused(true)}
                  onBlur={() => setIsCvvFocused(false)}
                  required
                />
              </InputGroup>
            </Row>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: theme.colors.textSecondary, fontSize: '0.9rem' }}>
              <FaShieldAlt style={{ color: '#10b981' }} />
              Encrypted 256-bit SSL Connection
            </div>

            <PayButton type="submit" disabled={processing}>
              {processing ? 'Processing Transaction...' : `Complete Payment - $${total.toFixed(2)}`}
            </PayButton>
          </Form>

          <TrustSection>
            <FaCcVisa />
            <FaCcMastercard />
            <FaLock />
            <FaShieldAlt />
          </TrustSection>
        </PaymentSection>
      </CheckoutGrid>

      <AnimatePresence>
        {processing && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: '4rem', marginBottom: '2rem' }}
            >
              <FaRocket />
            </motion.div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Securing Your Future...</h2>
            <p style={{ opacity: 0.8, marginTop: '1rem' }}>Verifying payment with your bank</p>
          </LoadingOverlay>
        )}
      </AnimatePresence>
    </PaymentContainer>
  );
}

export default Payment;