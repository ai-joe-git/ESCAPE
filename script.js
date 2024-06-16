// Smooth scrolling for navigation links
$('a[href*="#"]').on('click', function(e) {
    e.preventDefault();
  
    $('html, body').animate(
      {
        scrollTop: $($(this).attr('href')).offset().top - 80,
      },
      500,
      'linear'
    );
  });
  
  // Add a fun animation to the hero section
  const heroText = document.querySelector('.hero h1');
  let textIndex = 0;
  const text = heroText.textContent;
  
  function animateText() {
    heroText.textContent = text.slice(0, textIndex);
    textIndex++;
    if (textIndex > text.length) {
      textIndex = 0;
    }
    setTimeout(animateText, 200);
  }
  
  animateText();