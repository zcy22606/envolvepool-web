import { LaunchDetailContext } from '@/app/[lang]/(web)/[id]/constants/type';
import Button from '@/components/Common/Button';
import Modal from '@/components/Common/Modal';
import { LangContext } from '@/components/Provider/Lang';
import { useTranslation } from '@/i18n/client';
import { TransNs } from '@/i18n/config';
import { FuelInfo } from '@/service/webApi/launchPool/type';
import React, { useContext } from 'react';
import { FiX } from 'react-icons/fi';

interface UnstakeModalProp {
  open: boolean;
  onClose: VoidFunction;
  fule: FuelInfo;
}

const UnstakeModal: React.FC<UnstakeModalProp> = ({ open, onClose, fule }) => {
  const { loading, handleUnStake, launchInfo } = useContext(LaunchDetailContext);
  const { lang } = useContext(LangContext);
  const { t } = useTranslation(lang, TransNs.LAUNCH_POOL);
  return (
    <Modal
      open={open}
      onClose={onClose}
      showCloseIcon={true}
      iconClassName="right-[1rem] top-[1rem]"
      icon={<FiX size={20} />}
    >
      <div className="w-full rounded-[1.25rem] bg-neutral-white px-[1.5rem]  py-[2.25rem]  text-[#0B0D41]">
        <div className="">
          <div className="text-h3-mob text-center">{t('unStake')} $EDU</div>
          <p className="body-s my-[1.5rem]  text-[#0B0D41]">{t('unStakeWarning')}</p>
          <div className="">
            <Button
              loading={loading}
              type="primary"
              className="button-text-m  h-[3rem]  w-full p-0"
              onClick={() => handleUnStake(fule)}
            >
              {t('unStakeNow')}
            </Button>
            <Button ghost onClick={onClose} className="button-text-m  mt-[.75rem] h-[3rem]  w-full">
              {t('cancel')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UnstakeModal;
