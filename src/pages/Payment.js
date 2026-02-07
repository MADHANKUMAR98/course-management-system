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

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 3rem;
  text-align: left;
  
  h1 {
    font-size: clamp(2rem, 8vw, 3.5rem);
    font-weight: 950;
    margin-bottom: 1rem;
    background: ${props => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 1100px) {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
`;

const OrderSummary = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 2.5rem;
  border-radius: 30px;
  border: 1px solid ${props => props.theme.colors.border};
  height: fit-content;
  position: sticky;
  top: 100px;
  box-shadow: ${props => props.theme.shadows.md};

  @media (max-width: 1100px) {
    position: static;
    padding: 2rem;
    border-radius: 20px;
    width: 100%;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.3rem, 4vw, 1.6rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${props => props.theme.colors.text};
`;

const CartItem = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 600px) {
    align-items: center;
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 15px;
    object-fit: cover;
  }

  .info {
    flex: 1;
    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
    }
    p {
      color: ${props => props.theme.colors.textSecondary};
      font-size: 0.85rem;
    }
  }

  .price {
    font-weight: 800;
    font-size: 1.1rem;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: ${props => props.isTotal ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-weight: ${props => props.isTotal ? 900 : 500};
  font-size: ${props => props.isTotal ? '1.6rem' : '1rem'};
  margin-top: ${props => props.isTotal ? '1.5rem' : '0'};
  padding-top: ${props => props.isTotal ? '1.5rem' : '0'};
  border-top: ${props => props.isTotal ? `1px solid ${props.theme.colors.border}` : 'none'};
`;

const PaymentSection = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 3.5rem;
  border-radius: 30px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.xl};
  perspective: 1500px;

  @media (max-width: 1100px) {
    padding: 2rem;
    border-radius: 20px;
    width: 100%;
  }
`;

const CardPreview = styled(motion.div)`
  width: 100%;
  aspect-ratio: 1.6 / 1;
  max-width: 450px;
  margin: 0 auto 3rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  position: relative;
  box-shadow: 0 15px 35px rgba(0,0,0,0.3);
  overflow: hidden;
  transform-style: preserve-3d;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .chip {
    width: 45px;
    height: 35px;
    background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
    border-radius: 6px;
    margin-bottom: 2rem;
    @media (max-width: 768px) {
      margin-bottom: 1rem;
      width: 35px;
      height: 25px;
    }
  }

  .number {
    font-size: clamp(1.1rem, 5vw, 1.6rem);
    letter-spacing: 3px;
    font-family: 'Courier New', monospace;
    margin-bottom: 2rem;
    height: 1.8rem;
    @media (max-width: 768px) {
      margin-bottom: 1.5rem;
    }
  }

  .details {
    display: flex;
    justify-content: space-between;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 1.5px;
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 250px;
    height: 250px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  label {
    font-weight: 700;
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  input {
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    padding: 1rem;
    border-radius: 12px;
    color: ${props => props.theme.colors.text};
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}11;
      outline: none;
    }
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PayButton = styled(motion.button)`
  margin-top: 1rem;
  padding: 1.2rem;
  background: ${props => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-shadow: 0 10px 20px ${props => props.theme.colors.primary}33;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TrustIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.4rem;
  opacity: 0.4;
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 2rem;
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
    }, 800);
  }, [id]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      const sanitized = value.replace(/\D/g, '');
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

        if (month.length === 1 && parseInt(month) > 1) {
          month = '0' + month;
        }
        if (month.length === 2) {
          if (parseInt(month) > 12) month = '12';
          if (parseInt(month) === 0) month = '01';
        }

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: theme.colors.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontWeight: 700 }}>
          <FaArrowLeft /> Back
        </button>
        <h1>Secure Checkout</h1>
      </Header>

      <CheckoutGrid>
        {/* On Mobile, showing OrderSummary first for natural flow */}
        <OrderSummary>
          <SectionTitle><FaShoppingCart /> Order Summary</SectionTitle>
          <CartItem>
            <img src={course.image} alt={course.title} />
            <div className="info">
              <h3>{course.title}</h3>
              <p>by {course.instructor}</p>
            </div>
            <div className="price">${course.price}</div>
          </CartItem>

          <PriceRow>
            <span>Subtotal</span>
            <span>${course.price.toFixed(2)}</span>
          </PriceRow>
          <PriceRow>
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </PriceRow>
          <PriceRow isTotal>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </PriceRow>

          <div style={{ marginTop: '2rem', padding: '1.2rem', background: `${theme.colors.primary}08`, borderRadius: '15px', display: 'flex', gap: '0.8rem', color: theme.colors.textSecondary }}>
            <FaInfoCircle style={{ color: theme.colors.primary, flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>Immediate access granted after transaction.</p>
          </div>
        </OrderSummary>

        <PaymentSection>
          <SectionTitle><FaCreditCard /> Payment Details</SectionTitle>

          <CardPreview
            animate={{ rotateY: isCvvFocused ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, padding: 'inherit', display: 'flex', flexDirection: 'column' }}>
              <div className="chip"></div>
              <div className="number">{formData.cardNumber || '•••• •••• •••• ••••'}</div>
              <div className="details" style={{ marginTop: 'auto' }}>
                <div>
                  <div style={{ opacity: 0.6, fontSize: '0.6rem', marginBottom: '0.2rem' }}>Card Holder</div>
                  <div style={{ fontSize: '0.9rem' }}>{formData.cardName || 'YOUR NAME'}</div>
                </div>
                <div>
                  <div style={{ opacity: 0.6, fontSize: '0.6rem', marginBottom: '0.2rem' }}>Expires</div>
                  <div style={{ fontSize: '0.9rem' }}>{formData.expiry || 'MM/YY'}</div>
                </div>
              </div>
            </div>
            <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ height: '45px', background: 'rgba(0,0,0,0.9)', width: '100%', marginBottom: '1.5rem' }}></div>
              <div style={{ background: 'white', color: 'black', padding: '0.5rem 1rem', borderRadius: '4px', textAlign: 'right', fontWeight: 800, width: '85%', margin: '0 auto' }}>
                {formData.cvv || '•••'}
              </div>
            </div>
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
                autoComplete="cc-number"
              />
            </InputGroup>

            <InputGroup>
              <label>Name on Card</label>
              <input
                name="cardName"
                placeholder="Full Name"
                value={formData.cardName}
                onChange={handleInputChange}
                required
                autoComplete="cc-name"
              />
            </InputGroup>

            <Row>
              <InputGroup>
                <label><FaCalendarAlt /> Expiration</label>
                <input
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  required
                  autoComplete="cc-exp"
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
                  autoComplete="cc-csc"
                />
              </InputGroup>
            </Row>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: theme.colors.textSecondary, fontSize: '0.85rem' }}>
              <FaShieldAlt style={{ color: '#10b981' }} />
              Secure 256-bit encrypted payment
            </div>

            <PayButton type="submit" disabled={processing} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {processing ? 'Verifying...' : `Pay Now - $${total.toFixed(2)}`}
            </PayButton>
          </Form>

          <TrustIcons>
            <FaCcVisa />
            <FaCcMastercard />
            <FaLock />
          </TrustIcons>
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
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
            >
              <FaRocket />
            </motion.div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 900 }}>Processing...</h2>
            <p style={{ opacity: 0.7, marginTop: '0.8rem' }}>Please do not close this window.</p>
          </LoadingOverlay>
        )}
      </AnimatePresence>
    </PaymentContainer>
  );
}

export default Payment;