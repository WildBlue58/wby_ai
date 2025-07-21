import styles from './another-button.module.css'

const AnotherButton = () => {
    return (
        <button className={styles['another-button']}>
            Another Button
        </button>
    )
}

export default AnotherButton;