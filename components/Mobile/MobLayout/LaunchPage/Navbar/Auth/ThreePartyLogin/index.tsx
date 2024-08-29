import Github from '@/public/images/login/github.svg';
import Google from '@/public/images/login/google.svg';
import webApi from '@/service';
import { ThirdPartyAuthType } from '@/service/webApi/user/type';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Button from '@/components/Common/Button';
import MetamaskLoginButton from '@/components/Web/Business/AuthModal/ThreePartyLogin/MetamaskLoginButton';

function ThreePartyLogin() {
  const [isMounted, setIsMounted] = useState(false);
  const query = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const loginThreeParty = async (type: ThirdPartyAuthType) => {
    const inviteCode = query.get('inviteCode');
    const params = inviteCode
      ? {
          inviteCode
        }
      : {};
    switch (type) {
      default:
        const res = (await webApi.userApi.getAuthUrl(type, params)) as any;
        window.location.href = res?.url;
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full">
      <div className="relative flex justify-center">
        <div className="body-s flex h-[30px] items-center  text-center text-neutral-medium-gray">or continue with</div>
        <div className="absolute left-0 top-1/2 h-[1px] w-[calc(50%-80px)] -translate-y-1/2 bg-neutral-medium-gray"></div>
        <div className="absolute right-0 top-1/2 h-[1px] w-[calc(50%-80px)] -translate-y-1/2 bg-neutral-medium-gray"></div>
      </div>
      <div className="mt-4 flex justify-center gap-8">
        <Button ghost onClick={() => loginThreeParty(ThirdPartyAuthType.GOOGLE)} className="body-m  p-3">
          <Image src={Google} width={24} height={24} alt="Google"></Image>
        </Button>
        <Button ghost onClick={() => loginThreeParty(ThirdPartyAuthType.GITHUB)} className="body-m   p-3">
          <Image src={Github} width={24} height={24} alt="Github"></Image>
        </Button>
        <MetamaskLoginButton></MetamaskLoginButton>
      </div>
    </div>
  );
}

export default ThreePartyLogin;
