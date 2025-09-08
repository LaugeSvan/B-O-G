// Select all navs with the class 'nav'
  const navs = document.querySelectorAll('nav.nav');

  navs.forEach(nav => {
    nav.innerHTML = `
      <ul>
        <li><a href="../">Hjem</a></li>
        <li class="dropdown">
          <a href="#">Begynd!</a>
          <ul class="dropdown-menu">
            <li><a href="../subject?subject=dk">Dansk</a></li>
            <li><a href="../subject?subject=en">Engelsk</a></li>
            <li><a href="../subject?subject=de">Tysk</a></li>
            <li><a href="../subject?subject=math">Matematik</a></li>
          </ul>
        </li>
        <li><a href="../about">Om Os</a></li>
      </ul>
    `;
  });