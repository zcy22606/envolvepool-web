import { FC, useMemo, useState, useContext } from 'react';
import { ParticipationStatus, connectKeyMap } from '../constant';
import { cn } from '@/helper/utils';
import { LangContext } from '@/components/Provider/Lang';
import { useTranslation } from '@/i18n/client';
import { TransNs } from '@/i18n/config';
import { ConnectType } from '@/service/webApi/user/type';
interface ConnectProgressProps {
  connectType: ConnectType | ParticipationStatus;
}

const ConnectProgress: FC<ConnectProgressProps> = ({ connectType }) => {
  const [connectState, setConnectState] = useState(connectKeyMap);
  const { lang } = useContext(LangContext);
  const { t } = useTranslation(lang, TransNs.LAUNCH_POOL);
  const connectIndex = useMemo(() => {
    return connectKeyMap.findIndex((item) => item.key === connectType);
  }, [connectType]);
  return (
    <div className="flex gap-[10px]">
      {connectKeyMap.map((item, index) => {
        return (
          <div key={item.key} className="body-l-bold flex w-[50%] flex-col gap-2">
            <div
              className={cn(
                `h-[6px] w-full rounded-full`,
                index <= connectIndex ? 'bg-[#121BDF]' : 'bg-neutral-light-gray'
              )}
            ></div>
            <span
              className={cn(index <= connectIndex ? 'text-neutral-rich-gray' : 'text-neutral-light-gray')}
            >{`${index + 1} ${t(item.label)}`}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ConnectProgress;
