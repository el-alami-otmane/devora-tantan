const header = document.querySelector('#siteHeader');
const progressBar = document.querySelector('#progressBar');
const menuButton = document.querySelector('#menuButton');
const siteNav = document.querySelector('#siteNav');

function updateScrollUI() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  header.classList.toggle('scrolled', window.scrollY > 24);
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  siteNav.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.program-card').forEach((card) => {
      const categories = card.dataset.category.split(' ');
      card.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

const contactForm = document.querySelector('#contactForm');
const submitButton = document.querySelector('#submitButton');
const formStatus = document.querySelector('#formStatus');
const formEndpoint = 'https://docs.google.com/forms/d/e/1FAIpQLSdLk3L8vpDB3b4kVVudkNcSIuKMk6_1DLtrARsofODUlqBpfA/formResponse';

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = '';
  formStatus.classList.remove('error');
  submitButton.disabled = true;
  submitButton.textContent = 'Envoi en cours…';

  const formData = new FormData();
  formData.append('entry.1618252855', document.querySelector('#name').value.trim());
  formData.append('entry.1864290460', document.querySelector('#email').value.trim());
  formData.append('entry.1525528485', `[${document.querySelector('#subject').value}] ${document.querySelector('#message').value.trim()}`);

  try {
    await fetch(formEndpoint, { method: 'POST', mode: 'no-cors', body: formData });
    contactForm.reset();
    formStatus.textContent = 'Merci ! Votre message a bien été envoyé.';
  } catch (error) {
    formStatus.textContent = 'L’envoi a échoué. Écrivez-nous à administration@devora-info.net.';
    formStatus.classList.add('error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Envoyer le message';
  }
});
