import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  .tab-content {
    padding: 1rem 0;
  }
`;
export const Nav = styled.div`
  .nav-pills {
    background: #fbfbfb;
    font-weight: 500;
    --bs-nav-pills-border-radius: 0;
    --bs-nav-link-color: #000;
    --bs-nav-pills-link-active-color: #000;
    --bs-nav-pills-link-active-bg: #fbfbfb;
    --bs-nav-link-padding-y: 0.75rem;
    border-bottom: 1px solid #eee;
    padding-top: 3px;
  }
  .nav-link.active {
    border-bottom: 3px solid #dd3345;
  }

  .nav-item:not(:has(> .disabled)):hover {
    background: #dd334456;
    .nav-link {
      color: #dd3345;
    }
  }

  margin: 0 -12px;
`;
