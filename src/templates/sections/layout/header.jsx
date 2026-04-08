import styles from '@/styles/sections/layout/header.module.scss'

export default function Header(){
    return (
        <header className={styles.header}>
            <div className={styles['header-wrapper']}>
                <a className={styles.logo} href="/">AutoWorldSPA</a>
            </div>
        </header>
    )
}