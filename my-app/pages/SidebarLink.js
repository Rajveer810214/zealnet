import styles from "../styles/sidebarLink.module.css";

function SidebarLink({ text }) {
  return(
    <div className={styles.link} >
        <h2 className={styles.menuname}>{text}</h2>
    </div>
  );
}
export default SidebarLink;