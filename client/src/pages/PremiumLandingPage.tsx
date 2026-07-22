import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTrendingUp, FiGlobe, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';

function PremiumLandingPage() {
  const stats = [
    { value: 2.4, suffix: ' Trillion', label: 'Financial Fraud/Year', icon: '💰' },
    { value: 98.7, suffix: '%', label: 'Detection Accuracy', icon: '🎯' },
    { value: 250, suffix: '+', label: 'Fraud Patterns', icon: '🔍' },
    { value: 150, suffix: '+', label: 'Countries Supported', icon: '🌍' },
  ];

  const features = [
    {
      icon: <FiShield size={24} />,
      title: 'AI Fraud Detection',
      description: 'Advanced machine learning models trained on millions of fraud cases',
    },
    {
      icon: <FiTrendingUp size={24} />,
      title: 'Transaction Intelligence',
      description: 'Real-time analysis of payment flows and behavioral patterns',
    },
    {
      icon: <FiGlobe size={24} />,
      title: 'Network Analysis',
      description: 'Visualize complex relationships across accounts and entities',
    },
    {
      icon: <FiZap size={24} />,
      title: 'Report Generator',
      description: 'Generate professional investigation reports in seconds',
    },
    {
      icon: <FiZap size={24} />,
      title: 'Behavior Analytics',
      description: 'Detect anomalies and deviation patterns automatically',
    },
    {
      icon: <FiTrendingUp size={24} />,
      title: 'Real-time Monitoring',
      description: 'Continuous threat detection and alert management',
    },
  ];

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #081229, #0f1a35, #1a2847, #081229)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 20s ease infinite',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '50%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 40px',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '900px' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="eyebrow"
              style={{
                fontSize: '0.9rem',
                marginBottom: '24px',
              }}
            >
              Enterprise Financial Crime Investigation Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontSize: '4.2rem',
                fontWeight: 900,
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #00d9ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-2px',
              }}
            >
              GARUDA AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                fontSize: '1.2rem',
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                maxWidth: '700px',
                margin: '0 auto 32px',
                lineHeight: 1.8,
              }}
            >
              Investigate suspicious transactions, visualize money movement, and surface fraudulent activity with
              a world-class AI-powered cyber security command center used by financial institutions globally.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '60px',
              }}
            >
              <Link to="/dashboard" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Start Investigation
                <FiArrowRight size={18} />
              </Link>
              <button className="btn btn-secondary">Watch Demo</button>
            </motion.div>

            {/* Stats Display */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '20px',
                marginTop: '60px',
              }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(0, 217, 255, 0.4)' }}
                  style={{
                    padding: '20px',
                    background: 'rgba(15, 26, 53, 0.5)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 217, 255, 0.15)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'border-color var(--transition-fast)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
                  <div
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: 'var(--neon-cyan)',
                      marginBottom: '4px',
                    }}
                  >
                    <AnimatedCounter end={stat.value} duration={2.5} suffix={stat.suffix} decimals={1} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          style={{
            padding: '100px 40px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="eyebrow" style={{ marginBottom: '16px' }}>
              POWERFUL FEATURES
            </div>
            <h2 style={{ marginBottom: '12px' }}>Enterprise-Grade Capabilities</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Deployed by financial crime investigators, compliance teams, and law enforcement worldwide
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  borderColor: 'rgba(0, 217, 255, 0.4)',
                  boxShadow: '0 0 30px rgba(0, 217, 255, 0.15)',
                }}
                style={{
                  padding: '28px',
                  background: 'rgba(15, 26, 53, 0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 217, 255, 0.15)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(37, 99, 235, 0.2))',
                    borderRadius: '10px',
                    color: 'var(--neon-cyan)',
                    marginBottom: '16px',
                    fontSize: '1.4rem',
                  }}
                >
                  {feature.icon}
                </div>
                <h4 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{feature.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section
          style={{
            padding: '80px 40px',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ marginBottom: '20px' }}>Ready to Detect Fraud?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Join leading financial institutions using GARUDA AI to combat fraud and protect their customers
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/dashboard" className="btn btn-primary">
                Launch Dashboard
              </Link>
              <button className="btn btn-secondary">Contact Sales</button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: '40px',
            borderTop: '1px solid rgba(0, 217, 255, 0.1)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: '0.9rem',
          }}
        >
          <p>© 2025 GARUDA AI. Powering financial crime investigations worldwide.</p>
        </footer>
      </div>
    </div>
  );
}

export default PremiumLandingPage;
