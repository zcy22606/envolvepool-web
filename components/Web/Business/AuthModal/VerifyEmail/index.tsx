import { FC, ReactNode, useEffect, useState } from 'react';

import Button from '@/components/Common/Button';
import RightArrowIcon from '@/components/Common/Icon/RightArrow';
import Input from '@/components/Common/Input';
import { BurialPoint } from '@/helper/burialPoint';
import { useDebounceFn, useKeyPress } from 'ahooks';
import Schema from 'async-validator';
import { AuthType } from '@/store/zustand/userStore';
import { useLang } from '@/components/Provider/Lang';
import { useTranslation } from '@/i18n/client';
import { TransNs } from '@/i18n/config';

interface VerifyEmailProps {
  // onStatusChange: (status: boolean) => void;
  onNext: (email: string, inviteCode?: string) => void;
  validator: Schema;
  emailTitle?: ReactNode;
  value?: string;
  type: AuthType;
}

const VerifyEmail: FC<VerifyEmailProps> = (props) => {
  const { onNext, value, emailTitle: EmailTitle, validator, type } = props;
  const { lang } = useLang();
  const { t } = useTranslation(lang, TransNs.AUTH);

  const [formData, setFormData] = useState<{
    email: string;
  }>({
    email: value || ''
  });

  const [formState, setFormState] = useState({
    email: {
      status: 'default',
      errorMessage: ''
    }
  });

  const [loading, setLoading] = useState(false);

  const { run: verifyEmail } = useDebounceFn(
    () => {
      setLoading(true);
      if (type === AuthType.LOGIN) {
        BurialPoint.track('login-登录next按钮');
      }
      if (type === AuthType.SIGN_UP) {
        BurialPoint.track('signup-注册next按钮');
      }

      validator.validate(formData, (errors, fields) => {
        if (errors?.[0]) {
          setFormState({
            ...formState,
            email: {
              status: 'error',
              errorMessage: errors?.[0].message || ''
            }
          });
          // setErrorMessage(errors?.[0].message || '');
          if (type === AuthType.LOGIN) {
            BurialPoint.track('login-登录邮箱验证失败', {
              message: errors?.[0].message || ''
            });
          }
          if (type === AuthType.SIGN_UP) {
            BurialPoint.track('signup-注册邮箱验证失败', {
              message: errors?.[0].message || ''
            });
          }
        } else {
          if (type === AuthType.LOGIN) {
            BurialPoint.track('login-登录邮箱验证成功');
          }
          if (type === AuthType.SIGN_UP) {
            BurialPoint.track('signup-注册邮箱验证成功');
          }
          setFormState({
            ...formState,
            email: {
              status: 'success',
              errorMessage: ''
            }
          });

          onNext(formData.email);
        }
        setLoading(false);
      });
    },
    { wait: 500 }
  );

  useKeyPress('enter', verifyEmail);

  useEffect(() => {
    // BurialPoint.track();
    const startTime = new Date().getTime();
    return () => {
      const endTime = new Date().getTime();
      const duration = endTime - startTime;
      if (type === AuthType.LOGIN) {
        BurialPoint.track('login-登录邮箱验证停留时间', { duration });
      }
      if (type === AuthType.SIGN_UP) {
        BurialPoint.track('signup-注册邮箱验证停留时间', { duration });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const { run: checkStatus } = useDebounceFn(
  //   (e) => {
  //     validator.validate({ email: e.target.value }, (errors, fields) => {
  //       if (errors?.[0]) {
  //         onStatusChange(false);
  //       } else {
  //         onStatusChange(true);
  //       }
  //     });
  //   },
  //   { wait: 500 }
  // );

  return (
    <div className="flex h-full w-full flex-col items-center">
      {/* <ThirdPartyLogin></ThirdPartyLogin> */}
      <div className="flex w-full flex-col gap-[24px]">
        {EmailTitle}
        <Input
          label={t('email')}
          type="email"
          placeholder={t('enter_email')}
          name="email"
          theme="light"
          clear
          state={formState.email.status as any}
          errorMessage={formState.email.errorMessage}
          delay={500}
          onChange={(e) => {
            setFormData({
              ...formData,
              email: e.target.value
            });

            setFormState({
              ...formState,
              email: {
                status: 'default',
                errorMessage: ''
              }
            });
          }}
          defaultValue={formData.email}
        ></Input>
        <Button
          onClick={verifyEmail}
          block
          type="primary"
          disabled={loading}
          icon={<RightArrowIcon size={24}></RightArrowIcon>}
          iconPosition="right"
          loading={loading}
          className="button-text-l py-4 uppercase"
        >
          {t('continue')}
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
