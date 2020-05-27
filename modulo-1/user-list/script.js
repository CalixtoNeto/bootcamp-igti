const listUsers = document.querySelector('#user-list');
const listStatistics = document.querySelector('#statistics');

let users;
let filteredUsers;
let statistics;
let searchInput;

const getUsersApi = async () => {
  try {
    const response = await fetch(
      'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
    );
    const json = await response.json();
    users = json.results.map((user) => ({
      name: user.name.first + ' ' + user.name.last,
      gender: user.gender,
      age: user.dob.age,
      thumbnail: user.picture.thumbnail,
    }));
    filterUsers();
  } catch (error) {
    alert(`Error ${error}`);
  }
};

const filterUsers = (value) => {
  if (!users) return;
  filteredUsers = !value
    ? []
    : users
        .filter((user) => user.name.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
  showUsers();
  showStatistics();
};

const showUsers = () => {
  if (!filteredUsers.length) {
    listUsers.innerHTML =
      "<h2 class='lead text-center'>Nenhum usuário filtrado</h2>";
    return;
  }
  listUsers.innerHTML =
    `
    <h2 class='lead text-center''>${filteredUsers.length} usuário${
      filteredUsers.length > 1 ? 's' : ''
    } encontrado${filteredUsers.length > 1 ? 's' : ''}
    </h2>
    <ul class="list-group">` +
    filteredUsers
      .map(
        (user) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <img src='${user.thumbnail}' alt='thumbnail' />
            <span >
                ${user.name}, ${user.age} anos
            </span>
        </li>`
      )
      .join('') +
    '</ul>';
};

const showStatistics = () => {
  if (!filteredUsers.length) {
    listStatistics.innerHTML =
      "<h2 class='lead text-center'>Nada a ser exibido</h2>";
    return;
  }
  const ageSum = filteredUsers.reduce((memo, user) => memo + user.age, 0);
  const statistics = {
    male: filteredUsers.filter((user) => user.gender == 'male').length,
    female: filteredUsers.filter((user) => user.gender == 'female').length,
    ageSum,
    ageAvg: ageSum / filteredUsers.length,
  };
  listStatistics.innerHTML = `
        <h2 class='lead text-center'>
            Estatísticas
        </h2>
        <ul "list-group">
            <li class="list-group-item">Sexo Masculino : ${statistics.male.toFixed(
              0
            )}</li>
            <li class="list-group-item">Sexo Feminino : ${statistics.female.toFixed(
              0
            )}</li>
            <li class="list-group-item">Soma das idades : ${statistics.ageSum.toFixed(
              0
            )}</li>
            <li class="list-group-item">Média das idades : ${statistics.ageAvg.toFixed(
              2
            )}</li>
        </ul>
    `;
};

const events = () => {
  const input = document.querySelector('#input-search');

  document.querySelector('#btn-search').addEventListener('click', () => {
    filterUsers(input.value);
  });
  input.addEventListener('keyup', (event) => {
    filterUsers(input.value);
  });
};

const init = () => {
  getUsersApi();
  events();
};

window.addEventListener('load', init);
