import styles from './NavBar.module.scss';

type NavBarProps = {
    items: string[];
};

function NavBar(props: NavBarProps) {
    const { items } = props;

    return (
        <nav className={styles.nav}>
            <ul className={styles.list}>
                {items.map((item, index) => (
                    <li key={index} className={styles.item}><a href="#">{item}</a></li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBar;
