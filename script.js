const poke_container = document.getElementById('poke-container');
const pokemon_count = 150; // Reducido a un número razonable
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

const main_types = Object.keys(colors);

// Función principal para cargar los Pokémon
const fetchPokemons = async () => {
    for (let i = 1; i <= pokemon_count; i++) {
        await getPokemon(i);
    }
};

// Obtener datos de un Pokémon específico
const getPokemon = async (id) => {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/ ${id}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Error fetching Pokémon #${id}: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        createPokemonCard(data);
    } catch (error) {
        console.error(error.message);
    }
};

// Crear tarjeta de Pokémon
const createPokemonCard = (pokemon) => {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, '0');

    // Obtener tipos del Pokémon
    const poke_types = pokemon.types.map(type => type.type.name);
    const type1 = poke_types[0];
    const type2 = poke_types[1] || ''; // Segundo tipo, si existe

    const color = colors[type1];

    pokemonEl.style.backgroundColor = color;

    // Contenido HTML de la tarjeta
    const pokemonInnerHTML = `
        <div class="img-container">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/ ${pokemon.id}.png" alt="${name}">
        </div>
        <div class="info">
            <span class="number">#${id}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Type: <span>${type1}${type2 ? `, ${type2}` : ''}</span></small>
        </div>
    `;

    pokemonEl.innerHTML = pokemonInnerHTML;

    // Agregar evento de clic para mostrar detalles
    pokemonEl.addEventListener('click', async () => {
        await showPokemonDetails(pokemon);
    });

    poke_container.appendChild(pokemonEl);
};

// Mostrar detalles del Pokémon al hacer clic
const showPokemonDetails = async (pokemon) => {
    try {
        // Verificar si `species` y `species.url` existen
        if (!pokemon.species || !pokemon.species.url) {
            console.error(`Missing species data for Pokémon #${pokemon.id}`);
            alert("No se pudo cargar la información de este Pokémon.");
            return;
        }

        const speciesUrl = pokemon.species.url;
        const speciesRes = await fetch(speciesUrl);

        if (!speciesRes.ok) {
            throw new Error(`Error fetching species data for Pokémon #${pokemon.id}`);
        }

        const speciesData = await speciesRes.json();

        // Determinar la generación
        const generation = speciesData.generation.name.replace('generation-', 'Generation ').toUpperCase();

        // Mostrar detalles en una alerta
        const details = `
            Name: ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
            ID: #${pokemon.id.toString().padStart(3, '0')}
            Types: ${pokemon.types.map(type => type.type.name).join(', ')}
            Generation: ${generation}
            Height: ${pokemon.height / 10} m
            Weight: ${pokemon.weight / 10} kg
        `;

        alert(details); // Puedes reemplazar esto con un modal si prefieres
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al cargar los detalles del Pokémon.");
    }
};

// Iniciar la carga de Pokémon
fetchPokemons();
