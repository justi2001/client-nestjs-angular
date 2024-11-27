"use client";

import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;
  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        nguyenquyenluc ©{new Date().getFullYear()} Created by @quyenluc
      </Footer>
    </>
  );
};

export default AdminFooter;
