import styles from "../styles/sidebar.module.css";
import SidebarLink from "./SidebarLink.js";
import Link from 'next/link'

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      {/* <FaHome /> */}
      <SidebarLink text="Home" />
      <Link href='components/Addfriend'><SidebarLink text="AddFriends" /></Link>
      <SidebarLink text="Notifications" />
      <Link href="/message">  <SidebarLink text="Messages" /></Link>
      <SidebarLink text="Bookmarks" />
      <SidebarLink text="Lists" />
      <Link href="/profile">  <SidebarLink text="Profile" /></Link>
      <SidebarLink text="More" />
    </div>
  );
}

export default Sidebar;