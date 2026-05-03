const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');

if (menuToggle && navbar) {
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('open');
  });
}

const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      event.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

const navLinks = document.querySelectorAll('.site-header .nav a');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
  const pageName = new URL(link.href).pathname.split('/').pop();
  if (pageName === currentPage || (currentPage === '' && pageName === 'index.html')) {
    link.classList.add('active');
  }
});

window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
});

const formStatus = document.getElementById('formStatus');
const contactForm = document.getElementById('contactForm');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const accessKey = formData.get('access_key');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';

    formStatus.hidden = false;

    if (!accessKey) {
      formStatus.textContent = 'Add your Web3Forms access key to activate this form.';
      formStatus.classList.remove('is-success');
      formStatus.classList.add('is-error');
      return;
    }

    formStatus.textContent = 'Sending message...';
    formStatus.classList.remove('is-success', 'is-error');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        formStatus.textContent = 'Thanks! Your message has been sent.';
        formStatus.classList.remove('is-error');
        formStatus.classList.add('is-success');
        contactForm.reset();
        return;
      }

      formStatus.textContent = result.message || 'Something went wrong. Please try again.';
      formStatus.classList.remove('is-success');
      formStatus.classList.add('is-error');
    } catch (error) {
      formStatus.textContent = 'Unable to send right now. Please try again in a moment.';
      formStatus.classList.remove('is-success');
      formStatus.classList.add('is-error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
