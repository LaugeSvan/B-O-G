// Select all navs with the class 'nav'
  const navs = document.querySelectorAll('nav.nav');
  const cookie = document.getElementById('cookieCon');

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
        <li><a href="../overview">Oversigt</a></li>
      </ul>
    `;
  });

    if (cookie) {
    cookie.innerHTML = `
    <div class="container">
        <div class="subcontainer">
            <div id="cookies" class="cookies">
                <p>B-O-G bruger cookies for at give den bedste oplevelse. Er det fint? <a target="_blank" rel="noopener noreferrer" href="https://www.aboutcookies.org/eu-cookie-law">Mere info.</a></p>
                <button id="cookies-btn">Det er fint!</button>
            </div>
        </div>
    </div>

    `;
    }
