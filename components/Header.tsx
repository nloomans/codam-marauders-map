import Link from 'next/link';

const floors = [0, 1];

const Header = () => (
    <header>
        <nav>
            {floors.map(floor => (
                <Link key={floor} as={`/floor/${floor}`} href={{ pathname: '/view', query: { floor } }} >
                    <a title={`Floor ${floor}`}>F{floor}</a>
                </Link>
            ))}
        </nav>
    </header>
);

export default Header;
