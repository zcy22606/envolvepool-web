import Button from '@/components/Common/Button';
import RightArrowIcon from '@/components/Common/Icon/RightArrow';
import Checkbox from '@/components/Common/Checkbox';
import Input from '@/components/Common/Input';
import { BurialPoint } from '@/helper/burialPoint';
import { useValidator } from '@/hooks/auth/useValidator';
import webApi from '@/service';
import { useDebounceFn } from 'ahooks';
import message from 'antd/es/message';
import { FC, useState } from 'react';
import WhiteListModal from '../WhiteListModal';
import { AuthType, useUserStore } from '@/store/zustand/userStore';
import { useLang } from '@/components/Provider/Lang';
import { useTranslation } from '@/i18n/client';
import { TransNs } from '@/i18n/config';

interface RegisterFormProps {
  email: string;
  onBack: VoidFunction;
  inviteCode?: string;
}

const RegisterForm: FC<RegisterFormProps> = (props) => {
  const { onBack } = props;
  const { lang } = useLang();
  const { t } = useTranslation(lang, TransNs.AUTH);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    reenterPassword: string;
    inviteCode: string | undefined;
  }>({
    email: props.email,
    password: '',
    inviteCode: props.inviteCode,
    reenterPassword: ''
  });

  const setAuthType = useUserStore((state) => state.setAuthType);

  const [formState, setFormState] = useState({
    // email: {
    //   status: 'default',
    //   errorMessage: ''
    // },
    password: {
      status: 'default',
      errorMessage: ''
    },
    reenterPassword: {
      status: 'default',
      errorMessage: ''
    }
  });

  const { validator } = useValidator([
    // 'registerEmail',
    'password',
    'reenterPassword'
  ]);

  const [acceptConditions, setAcceptCondition] = useState(false);
  const [acceptErrorMessage, setAcceptErrorMessage] = useState(false);
  const [showWhiteListModal, setShowWhiteListModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { run: onRegister } = useDebounceFn(
    () => {
      BurialPoint.track('signup-注册按钮点击');
      if (!acceptConditions) {
        BurialPoint.track('signup-没有同意隐私策略');
        setAcceptErrorMessage(true);
        return;
      }
      setLoading(true);
      validator.validate(formData, async (errors, fields) => {
        if (!errors) {
          const status: any = { ...formState };
          for (let key in status) {
            status[key] = { status: 'success', errorMessage: '' };
          }
          try {
            BurialPoint.track('signup-发送注册邮件');
            const res = await webApi.userApi.userRegister(formData);
            BurialPoint.track('signup-注册邮件发送成功');
            setAuthType(AuthType.EMAIL_VERIFY);
          } catch (e: any) {
            BurialPoint.track('signup-注册邮件发送失败', { message: e?.msg });
            console.log(e);
            if (e?.code === 400) setShowWhiteListModal(true);
            else message.error(e?.msg);
          }
          setLoading(false);
        } else {
          const status: any = { ...formState };
          errors.map((error) => {
            status[error.field as string] = {
              status: 'error',
              errorMessage: error.message
            };
          });
          setFormState(status);
          setLoading(false);
        }
      });
    },
    { wait: 500 }
  );

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="flex w-full flex-col gap-[24px]">
        <div>
          <Input
            label={t('password')}
            type="password"
            name="password"
            placeholder={t('password')}
            theme="light"
            // description="Use 8 or more characters with a mix of letters & numbers"
            state={formState.password.status as any}
            errorMessage={formState.password.errorMessage}
            delay={500}
            rules={{
              type: 'string',
              required: true,
              pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/,
              message: t('more_characters')
            }}
            onChange={(e) => {
              setFormData({
                ...formData,
                password: e.target.value
              });
            }}
          ></Input>
        </div>
        <div>
          <Input
            label={t('re_enter_password')}
            type="password"
            theme="light"
            placeholder={t('confirm_password')}
            name="reenterPassword"
            state={formState.reenterPassword.status as any}
            errorMessage={formState.reenterPassword.errorMessage}
            delay={500}
            rules={[
              // {
              //   type: 'string',
              //   required: true,
              //   pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/,
              //   message:
              //     'Use 8 or more characters with a mix of letters & numbers'
              // },
              {
                type: 'string',
                message: t('password_mismatch'),
                validator(rule, value) {
                  return value === formData.password;
                }
              }
            ]}
            onChange={(e) => {
              setFormData({
                ...formData,
                reenterPassword: e.target.value
              });
            }}
          ></Input>
        </div>
        <div className="flex flex-col gap-[.5rem]">
          <div className="flex items-center gap-[.75rem]">
            <Checkbox
              outClassNames={`${acceptConditions ? 'border-neutral-off-black' : 'border-neutral-medium-gray'}`}
              isCircle={true}
              innerClassNames="bg-neutral-off-black"
              onChange={(value) => {
                if (value) {
                  setAcceptErrorMessage(false);
                }
                setAcceptCondition(value);
              }}
            ></Checkbox>
          </div>
        </div>
      </div>
      <Button
        onClick={onRegister}
        block
        type="primary"
        loading={loading}
        disabled={loading}
        icon={<RightArrowIcon></RightArrowIcon>}
        iconPosition="right"
        className="button-text-l py-4 uppercase"
      >
        {t('continue')}
      </Button>
      <WhiteListModal open={showWhiteListModal} onClose={() => setShowWhiteListModal(false)}></WhiteListModal>
    </div>
  );
};

export default RegisterForm;
