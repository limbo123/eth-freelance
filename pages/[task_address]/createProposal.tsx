import { Router, useRouter } from 'next/router';
import React, { FC } from 'react'

const createProposal: FC = () => {
  const router = useRouter();
  console.log(router);
  return (
    <div>createProposal</div>
  )
}

export default createProposal